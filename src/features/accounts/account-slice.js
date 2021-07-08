import {createSlice} from '@reduxjs/toolkit';
import { WalletRpc } from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import { showToast, withErrorToast } from '../../core/toast';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';
import {createAccountActions} from '../account-creation/create-account-slice';
import Share from 'react-native-share'
import RNFS from 'react-native-fs';


const initialState = {
  loading: true,
  accounts: [],
  accountToBackup: null,
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
    setAccountToBackup(state, action) {
      state.accountToBackup = action.payload;
    },
  },
});

export const accountActions = account.actions;

const getRoot = state => state.account;

export const accountSelectors = {
  getLoading: state => getRoot(state).loading,
  getAccounts: state => getRoot(state).accounts,
  getAccountById: (id) => state => getRoot(state).accounts.find(account => account.id === id),
  getAccountToBackup: state => getRoot(state).accountToBackup,
  
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

  confirmAccountBackup: () => withErrorToast(async (dispatch, getState) => {
    const account = accountSelectors.getAccountToBackup(getState());
    
    if (!account) {
      return;
    }

    const updatedAccount = {
      ...account,
      meta: {
        ...account.meta,
        hasBackup: true,
      }
    }

    // update account meta
    await WalletRpc.update(updatedAccount);
    
    dispatch(accountActions.setAccountToBackup(null));
    
    navigate(Routes.ACCOUNT_DETAILS, {
      id: account.id,
    });

    await dispatch(accountOperations.loadAccounts());
    
    showToast({
      message: 'Backup complete!'
    })
  }),
  backupAccount: (account) =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(accountActions.setAccountToBackup(account));

      // get mnemonic phrase for the acount
      const result = await WalletRpc.query({
        equals: {
          'content.id': account.correlation[0]
        }
      });
      
      const phrase = result[0].value;

      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_MNEMONIC);
    }),
  addAccountFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },
  
  exportAccountAs: ({
    accountId,
    method,
    password
  }) => async (dispatch, getState) => { 
    const jsonData = JSON.stringify({"encoded":"a94pnHfOuh/27N07XBFK+g2THMhuVxOJrpVOzEF+VHgAgAAAAQAAAAgAAAAKLbYS5ZcPQFvhrr6ZdPBk0qZyqEwSbp/LnCh6x/K3E7tEszYoh2/KrDmI+J7LZFvnEv2TQucr1c6Eg/Qup5pzLu/RLn0eaoBdFQ8BgGyo3c2zLye5P1XcRePfNVhw+APJ/Uqkv5LUqMFEEEJEzBJg/Flqz6ZG6S3iOV9PEV5v6xvKvzPATR4mZCA5UljXz+j7JKUEMyg5MxoPscEp","encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"address":"3GoLUwuovRemYomjQGqD5Wo7ZEY2mTgw95iJPPaKhnPTzVVW","meta":{"genesisHash":"0xf73467c6544aa68df2ee546b135f955c46b90fa627e9b5d7935f41061bb8a5a9","name":"test","tags":[],"whenCreated":1622563948125,"meta":{"genesisHash":"0xf73467c6544aa68df2ee546b135f955c46b90fa627e9b5d7935f41061bb8a5a9"}}});
    let qrCodeData;

    if (method === 'json') {
      const path = `${RNFS.DocumentDirectoryPath}/${accountId}.json`;
      const mimeType = 'application/json';
      await RNFS.writeFile(path, jsonData);

      try {
        await Share.open({
          url: "file://" + path,
          type: mimeType,
        })
      } catch(err) {
       console.error(err);
       showToast({
         message: 'Unable to export account',
         type: 'error',
       }) 
      }
      
      RNFS.unlink(path);
    } else {
      qrCodeData = jsonData;
    }
    
    navigate(Routes.ACCOUNT_DETAILS, {
      accountId,
      qrCodeData,
    });

    showToast({
      message: 'Account exported',
    });
  },
  
  removeAccount: (account: any) => async (dispatch, getState) => {
    await WalletRpc.remove(account.id);
    
    dispatch(accountOperations.loadAccounts());

    showToast({
      message: 'Account removed'
    });
    
  },
  loadAccounts: () => async (dispatch, getState) => {
    try {
      await WalletRpc.load();
      await WalletRpc.sync();
    } catch(err) {}

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
