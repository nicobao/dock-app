import {createSlice} from '@reduxjs/toolkit';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {PolkadotUIRpc} from '@docknetwork/react-native-sdk/src/client/polkadot-ui-rpc';
import {ApiRpc} from '@docknetwork/react-native-sdk/src/client/api-rpc';
import {showToast, withErrorToast} from '../../core/toast';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {createAccountActions} from '../account-creation/create-account-slice';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {translate} from 'src/locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getRealm} from 'src/core/realm';
import {appOperations} from '../app/app-slice';
import uuid from 'uuid/v4';

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
    setAccount(state, action) {
      state.accounts = state.accounts.map(account => {
        if (account.id === action.payload.id) {
          return action.payload;
        }

        return account;
      });
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
  getAccountById: id => state =>
    getRoot(state).accounts.find(account => account.id === id),
  getAccountToBackup: state => getRoot(state).accountToBackup,
};

export const accountOperations = {
  addTestAccount: () => async (dispatch, getState) => {
    await WalletRpc.add({
      '@context': ['https://w3id.org/wallet/v1'],
      id: '0x774477c4cd54718d32d4df393415796b9bfcb63c',
      type: 'Account',
      name: 'cocomelon',
      balance: 0,
    });

    dispatch(accountOperations.loadAccounts());

    showToast({
      message: translate('account_setup.success'),
    });
  },

  confirmAccountBackup: () =>
    withErrorToast(async (dispatch, getState) => {
      const account = accountSelectors.getAccountToBackup(getState());

      if (!account) {
        return;
      }

      const updatedAccount = {
        ...account,
        meta: {
          ...account.meta,
          hasBackup: true,
        },
      };

      // update account meta
      await WalletRpc.update(updatedAccount);

      dispatch(accountActions.setAccountToBackup(null));

      navigate(Routes.ACCOUNT_DETAILS, {
        id: account.id,
      });

      await dispatch(accountOperations.loadAccounts());

      showToast({
        message: translate('create_account_backup.success'),
      });
    }),

  backupAccount: account =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(accountActions.setAccountToBackup(account));

      // get mnemonic phrase for the acount
      const result = await WalletRpc.query({
        equals: {
          'content.id': account.correlation[0],
        },
      });

      const phrase = result[0].value;

      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_MNEMONIC);
    }),
  addAccountFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },

  exportAccountAs:
    ({accountId, method, password}) =>
    async (dispatch, getState) => {
      const encryptedAccount = await WalletRpc.exportAccount(
        accountId,
        password,
      );
      const jsonData = JSON.stringify(encryptedAccount);

      let qrCodeData;

      if (method === 'json') {
        const path = `${RNFS.DocumentDirectoryPath}/${accountId}.json`;
        const mimeType = 'application/json';
        await RNFS.writeFile(path, jsonData);

        try {
          await Share.open({
            url: 'file://' + path,
            type: mimeType,
          });
        } catch (err) {
          console.error(err);
          showToast({
            message: translate('account_details.export_error'),
            type: 'error',
          });
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
        message: translate('account_details.export_success'),
      });
    },

  removeAccount: (account: any) => async (dispatch, getState) => {
    await WalletRpc.remove(account.id);

    dispatch(accountOperations.loadAccounts());

    showToast({
      message: translate('account_details.account_removed'),
    });
  },
  getPolkadotSvgIcon:
    (address, isAlternative) => async (dispatch, getState) => {
      await dispatch(appOperations.waitRpcReady());
      return PolkadotUIRpc.getPolkadotSvgIcon(address, isAlternative);
    },
  loadAccounts: () => async (dispatch, getState) => {
    const realm = getRealm();
    const cachedAccounts = realm.objects('Account').toJSON();
    dispatch(accountActions.setAccounts(cachedAccounts));

    console.log('Wait rpc ready');

    await dispatch(appOperations.waitRpcReady());

    console.log('Rpc done');

    let accounts = await WalletRpc.query({
      equals: {
        'content.type': 'Account',
      },
    });

    if (!Array.isArray(accounts)) {
      throw new Error('Invalid accounts data');
    }

    accounts = accounts.map(account => ({
      ...account,
      ...(account.meta || {}),
    }));

    realm.write(() => {
      accounts.forEach((account: any) => {
        realm.create(
          'Account',
          {
            id: account.id,
            name: account.name,
            balance: '0',
          },
          'modified',
        );
      });
    });

    dispatch(accountActions.setAccounts(accounts));
    dispatch(accountOperations.fetchBalances());
  },

  fetchBalances: () => async (dispatch, getState) => {
    console.log('Fetching balances');
    await dispatch(appOperations.waitDockReady());
    console.log('Fetching balances ok');

    const accounts = accountSelectors.getAccounts(getState());

    const realm = getRealm();

    accounts.forEach(async (account: any) => {
      const balance = await ApiRpc.getAccountBalance(account.id);

      console.log('Balance for account', {
        account,
        balance,
      });

      realm.write(() => {
        realm.create(
          'Account',
          {
            id: account.id,
            balance: `${balance}`,
          },
          'modified',
        );

        realm.create(
          'Transaction',
          {
            id: account.id,
            date: new Date().toString(),
            fromAddress: account.id,
            recipientAddress: account.id,
            amount: '10000000',
            feeAmount: '1000',
            status: 'pending',
          },
          'modified',
        );
      });

      dispatch(
        accountActions.setAccount({
          ...account,
          balance,
        }),
      );
    });
  },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const accountReducer = account.reducer;
