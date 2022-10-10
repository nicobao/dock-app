import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';
import {keyringService} from '@docknetwork/wallet-sdk-core/lib/services/keyring';
import {createSlice} from '@reduxjs/toolkit';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {showToast, withErrorToast} from '../../core/toast';
import {
  accountActions,
  accountOperations,
  accountSelectors,
} from '../accounts/account-slice';
import {translate} from 'src/locales';

const initialState = {
  loading: true,
  form: {},
  mnemonicPhrase: '',
  accountToBackup: null,
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

function validateDerivationPath({phrase, type = 'sr25519', derivePath = ''}) {
  return keyringService
    .addressFromUri({
      mnemonic: phrase,
      type,
      derivePath,
    })
    .then(() => true)
    .catch(() => false);
}

async function validateAdvancedOptionsForm({phrase, form}) {
  const isDerivationPathValid = await validateDerivationPath({
    phrase,
    type: form.keypairType || 'sr25519',
    derivePath: form.derivationPath || '',
  });

  if (!isDerivationPathValid) {
    showToast({
      type: 'error',
      message: translate('account_advanced_options.invalid_derivation_path'),
    });
  }

  return isDerivationPathValid;
}

export const createAccountOperations = {
  initFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },
  checkExistingAccount: address => (dispatch, getState) => {
    const accounts = accountSelectors.getAccounts(getState());
    const accountExists = accounts.find(ac => ac.id === address);

    if (accountExists) {
      showToast({
        message: translate('import_account.existing_account'),
        type: 'error',
      });

      return true;
    }

    return false;
  },
  importFromJson: data =>
    withErrorToast(async (dispatch, getState) => {
      const jsonData = JSON.parse(data);

      if (
        await dispatch(
          createAccountOperations.checkExistingAccount(jsonData.address),
        )
      ) {
        return;
      }

      dispatch(
        createAccountActions.setForm({
          data: jsonData,
          json: true,
        }),
      );
      navigate(Routes.ACCOUNT_IMPORT_SETUP_PASSWORD);
    }, translate('import_account.invalid_account_data')),
  unlockJson: password => async (dispatch, getState) => {
    const form = createAccountSelectors.getForm(getState());
    await keyringService.addFromJson({
      jsonData: form.data,
      password,
    });
    dispatch(
      createAccountActions.setForm({
        ...form,
        json: form.data,
        password,
        accountName: form.data.meta && form.data.meta.name,
      }),
    );

    navigate(Routes.ACCOUNT_IMPORT_SETUP);
  },
  importFromMnemonic: form =>
    withErrorToast(async (dispatch, getState) => {
      const phrase = form.phrase.trim();
      const isValidPhrase = await utilCryptoService.mnemonicValidate(phrase);

      if (!isValidPhrase) {
        showToast({
          message: translate('import_account_from_mnemonic.invalid_phrase'),
          type: 'error',
        });

        return;
      }

      const isAdvancedOptionsValid = await validateAdvancedOptionsForm({
        phrase,
        form,
      });

      if (!isAdvancedOptionsValid) {
        return;
      }

      const address = await keyringService.addressFromUri({
        mnemonic: phrase,
        type: form.keypairType || 'sr25519',
        derivePath: form.derivationPath || '',
      });

      if (
        await dispatch(createAccountOperations.checkExistingAccount(address))
      ) {
        return;
      }

      dispatch(accountActions.setAccountToBackup(null));
      dispatch(
        createAccountActions.setForm({
          ...form,
        }),
      );
      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.ACCOUNT_IMPORT_SETUP);
    }),
  submitAccountForm: form =>
    withErrorToast(async (dispatch, getState) => {
      const phrase = await utilCryptoService.mnemonicGenerate(12);
      const isAdvancedOptionsValid = await validateAdvancedOptionsForm({
        phrase,
        form,
      });

      if (!isAdvancedOptionsValid) {
        return;
      }

      dispatch(accountActions.setAccountToBackup(null));
      dispatch(createAccountActions.setForm(form));
      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_BACKUP);
    }),
  createAccount: ({
    hasBackup = false,
    successMessage = translate('account_setup.success'),
    form: extraForm,
  } = {}) =>
    withErrorToast(async (dispatch, getState) => {
      const state = getState();
      const mnemonic = createAccountSelectors.getMnemonicPhrase(state);
      const form = {
        ...createAccountSelectors.getForm(state),
        ...extraForm,
      };

      let {accountName, keypairType, derivationPath} = form;

      if (!form.json) {
        await Wallet.getInstance().accounts.create({
          derivationPath,
          name: accountName,
          mnemonic,
          type: keypairType,
        });
      } else {
        await Wallet.getInstance().accounts.create({
          name: accountName,
          json: form.json,
          password: form.password,
        });
      }

      dispatch(accountOperations.loadAccounts());
      navigate(Routes.ACCOUNTS);
      showToast({
        message: successMessage,
      });
    }),
};

export const createAccountReducer = createAccount.reducer;
