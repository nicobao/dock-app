import {createSlice} from '@reduxjs/toolkit';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';
import {polkadotService} from '@docknetwork/wallet-sdk-core/lib/services/polkadot';
import {substrateService} from '@docknetwork/wallet-sdk-core/lib/services/substrate';
import {showToast, withErrorToast} from '../../core/toast';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {createAccountActions} from '../account-creation/create-account-slice';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {translate} from 'src/locales';
import {getRealm} from 'src/core/realm';
import {appOperations} from '../app/app-slice';
import {Logger} from 'src/core/logger';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';

// Period in seconds
const BALANCE_FETCH_PERIOD = 30;

const initialState = {
  loading: true,
  accounts: [],
  accountToBackup: null,
};

export const accountReducers = {
  setLoading(state, action) {
    state.loading = action.payload;
  },
  clearAccounts(state, action) {
    state.accounts = [];
  },
  setAccounts(state, action) {
    state.accounts = action.payload;
  },
  removeAccount(state, action) {
    state.accounts = state.accounts.filter(item => item.id !== action.payload);
  },
  setAccount(state, action) {
    state.accounts = state.accounts.map(account => {
      if (account.id === action.payload.id) {
        return {
          ...account,
          ...action.payload,
        };
      }

      return account;
    });
  },
  setAccountToBackup(state, action) {
    state.accountToBackup = action.payload;
  },
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: accountReducers,
});

export const accountActions = accountSlice.actions;

const getRoot = state => state.account;

export function exportFile({path, mimeType, errorMessage}) {
  return Share.open({
    url: 'file://' + path,
    type: mimeType,
  })
    .catch(err => {
      if (err.message === 'User did not share') {
        return;
      }

      console.error(err);
      showToast({
        message: errorMessage,
        type: 'error',
      });
      logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
        name: ANALYTICS_EVENT.WALLET.BACKUP,
        path,
        mimeType,
        errorMessage: err.message,
      });
    })
    .then(() => {
      logAnalyticsEvent(ANALYTICS_EVENT.WALLET.BACKUP, {
        path,
        mimeType,
        errorMessage,
      });
    })
    .finally(() => {
      RNFS.unlink(path);
    });
}

export const accountSelectors = {
  getLoading: state => getRoot(state).loading,
  getAccounts: state => getRoot(state).accounts,
  getAccountById: id => state =>
    getRoot(state).accounts.find(account => account.id === id),
  getAccountToBackup: state => getRoot(state).accountToBackup,
};

let fetchBalanceTimeout;

export const accountOperations = {
  confirmAccountBackup: () =>
    withErrorToast(async (dispatch, getState) => {
      const account = accountSelectors.getAccountToBackup(getState());

      if (!account) {
        return;
      }

      const updatedAccount = {
        ...account,
        meta: {
          ...(account.meta || {}),
          hasBackup: true,
        },
      };

      // update account meta
      try {
        await walletService.update(updatedAccount);
      } catch (err) {
        console.log(err);
        await walletService.load();
        await walletService.update(updatedAccount);
        logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
          message: err.message,
          name: ANALYTICS_EVENT.ACCOUNT.BACKUP,
        });
      }

      dispatch(accountActions.setAccountToBackup(null));

      navigate(Routes.ACCOUNT_DETAILS, {
        id: account.id,
      });

      await dispatch(accountOperations.loadAccounts());

      showToast({
        message: translate('create_account_backup.success'),
      });
      logAnalyticsEvent(ANALYTICS_EVENT.ACCOUNT.BACKUP, {
        accountId: account.id,
      });
    }),

  backupAccount: account =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(accountActions.setAccountToBackup(account));

      // get mnemonic phrase for the acount
      const result = await walletService.query({
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
      const encryptedAccount = await walletService.exportAccount({
        address: accountId,
        password,
      });
      const jsonData = JSON.stringify(encryptedAccount);

      let qrCodeData;

      if (method === 'json') {
        const path = `${RNFS.DocumentDirectoryPath}/${accountId}.json`;
        const mimeType = 'application/json';
        await RNFS.writeFile(path, jsonData);

        exportFile({
          path,
          mimeType,
          errorMessage: translate('account_details.export_error'),
        });
      } else {
        qrCodeData = jsonData;
      }

      navigate(Routes.ACCOUNT_DETAILS, {
        id: accountId,
        qrCodeData,
      });

      showToast({
        message: translate('account_details.export_success'),
      });
      logAnalyticsEvent(ANALYTICS_EVENT.ACCOUNT.EXPORT, {
        method,
        accountId,
      });
    },

  removeAccount: (account: any) => async (dispatch, getState) => {
    try {
      dispatch(accountActions.removeAccount(account.id));

      try {
        await walletService.remove(account.id);
      } catch (err) {
        console.error(err);
      }

      const realm = getRealm();

      realm.write(() => {
        const cachedAccount = realm
          .objects('Account')
          .filtered('id = $0', account.id)[0];

        console.log('Cached account', cachedAccount);
        if (!cachedAccount) {
          return;
        }

        realm.delete(cachedAccount);
      });

      showToast({
        message: translate('account_details.account_removed'),
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: translate('account_details.unable_to_remove_account'),
        type: 'error',
      });
    }
  },
  getPolkadotSvgIcon:
    (address, isAlternative) => async (dispatch, getState) => {
      await dispatch(appOperations.waitRpcReady());
      return polkadotService.getAddressSvg({
        address,
        isAlternative,
      });
    },
  loadAccounts: () => async (dispatch, getState) => {
    const realm = getRealm();
    const cachedAccounts = realm.objects('Account').toJSON();
    dispatch(accountActions.setAccounts(cachedAccounts));

    await dispatch(appOperations.waitRpcReady());

    await walletService.sync();

    let accounts = await walletService.query({
      equals: {
        'content.type': 'Account',
      },
    });

    if (!Array.isArray(accounts)) {
      return;
    }

    accounts = accounts.map(account => {
      const cachedAccount = cachedAccounts.find(item => item.id === account.id);
      const cachedBalance = cachedAccount && cachedAccount.balance;

      return {
        ...account,
        ...(account.meta || {}),
        balance: cachedBalance || account.balance,
      };
    });

    realm.write(() => {
      accounts.forEach((account: any) => {
        try {
          realm.create(
            'Account',
            {
              id: account.id,
              name: account.name || '',
              readyOnly: account.meta && account.meta.readOnly,
            },
            'modified',
          );
        } catch (err) {
          console.log(err);
        }
      });
    });

    dispatch(accountActions.setAccounts(accounts));
    dispatch(accountOperations.fetchBalances());
  },

  fetchAccountBalance: accountId => async (dispatch, getState) => {
    if (!accountId) {
      return;
    }

    const realm = getRealm();
    const balance = await substrateService.getAccountBalance({
      address: accountId,
    });
    const accounts = await walletService.query({
      equals: {
        'content.type': 'Account',
      },
    });
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
      console.log(accounts);
      console.log('Account not found for id', accountId);
      return;
    }

    realm.write(() => {
      realm.create(
        'Account',
        {
          id: accountId,
          name: account.meta && account.meta.name,
          balance: `${balance}`,
        },
        'modified',
      );
    });

    dispatch(
      accountActions.setAccount({
        id: accountId,
        balance,
      }),
    );
  },
  fetchBalances: () => async (dispatch, getState) => {
    try {
      await dispatch(appOperations.waitDockReady());

      const accounts = accountSelectors.getAccounts(getState());

      accounts.forEach(async (account: any) => {
        await dispatch(accountOperations.fetchAccountBalance(account.id));
      });
    } catch (err) {
      console.error(err);
    }

    clearTimeout(fetchBalanceTimeout);

    fetchBalanceTimeout = setTimeout(() => {
      dispatch(accountOperations.fetchBalances());
    }, 1000 * BALANCE_FETCH_PERIOD);
  },

  watchAccount:
    ({name, address}) =>
    async (dispatch, getState) => {
      Logger.debug('add account', {name, address});
      await walletService.add({
        '@context': ['https://w3id.org/wallet/v1'],
        id: address,
        type: 'Account',
        correlation: [],
        meta: {
          name: name,
          readOnly: true,
          balance: 0,
        },
      });

      dispatch(accountOperations.loadAccounts());
    },
};

export const accountReducer = accountSlice.reducer;
