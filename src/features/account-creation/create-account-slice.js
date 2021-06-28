import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {KeyringRpc} from '@docknetwork/react-native-sdk/src/client/keyring-rpc';
import {createSlice} from '@reduxjs/toolkit';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {showToast, withErrorToast} from '../../core/toast';
import {accountOperations} from '../accounts/account-slice';

const initialState = {
  loading: true,
  form: {},
  mnemonicPhrase: '',
};

const createAccount = createSlice({
  name: 'createAccount',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setForm(state, action) {
      state.form = action.payload;
    },
    setMnemonicPhrase(state, action) {
      state.mnemonicPhrase = action.payload;
    },
  },
});

export const createAccountActions = createAccount.actions;

const getRoot = state => state.createAccount;

export const createAccountSelectors = {
  getLoading: state => getRoot(state).loading,
  getForm: state => getRoot(state).form,
  getMnemonicPhrase: state => getRoot(state).mnemonicPhrase,
};

export const createAccountOperations = {
  initFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },
  submitAccountForm: form =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(createAccountActions.setForm(form));

      const phrase = await UtilCryptoRpc.mnemonicGenerate(12);

      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_BACKUP);
    }),
  createAccount: form =>
    withErrorToast(async (dispatch, getState) => {
      const state = getState();
      const phrase = createAccountSelectors.getMnemonicPhrase(state);
      const {accountName, keypairType, derivationPath} =
        createAccountSelectors.getForm(state);

      const address = await KeyringRpc.addressFromUri({
        phrase,
        type: keypairType || 'sr25519',
        derivePath: derivationPath || ''
      });

      await WalletRpc.add({
        '@context': ['https://w3id.org/wallet/v1'],
        id: address,
        type: 'Account',
        meta: {
          name: accountName,
          keypairType,
          derivationPath,
          balance: {
            value: 0,
            symbol: 'DOCK',
          },
        },
      });

      dispatch(accountOperations.loadAccounts());
      navigate(Routes.ACCOUNTS);
      showToast({
        message: 'Account successfully created',
      });
    }),
};

export const createAccountReducer = createAccount.reducer;
