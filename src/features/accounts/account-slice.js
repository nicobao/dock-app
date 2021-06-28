import {createSlice} from '@reduxjs/toolkit';
import { WalletRpc } from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import { showToast } from '../../core/toast';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';

const initialState = {
  loading: true,
  accounts: [],
};

const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
  },
});

export const accountActions = account.actions;

const getRoot = state => state.account;

export const accountSelectors = {
  getLoading: state => getRoot(state).loading,
  getAccounts: state => getRoot(state).accounts,
};

export const accountOperations = {
  
  
  addTestAccount: () => async (dispatch, getState) => {
    await WalletRpc.add(
      {
        "@context": [
          "https://w3id.org/wallet/v1"
        ],
        "id": "0x774477c4cd54718d32d4df393415796b9bfcb63c",
        "type": "Account",
        "name": "cocomelon",
        balance: {
          value: 0,
          symbol: 'DOCK'
        }
      }
    );
    
    dispatch(accountOperations.loadAccounts());

    showToast({
      message: 'Account successfully created'
    });
  },
  addAccountFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },
  
  removeAccount: (account: any) => async (dispatch, getState) => {
    await WalletRpc.remove(account.id);
    
    dispatch(accountOperations.loadAccounts());

    showToast({
      message: 'Account removed'
    });
    
  },
  loadAccounts: () => async (dispatch, getState) => {
    const accounts = await WalletRpc.query({
      equals: {
        'content.type': 'Account'
      }
    });
    
    dispatch(accountActions.setAccounts(accounts));
  },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const accountReducer = account.reducer;
