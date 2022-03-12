import {createSlice} from '@reduxjs/toolkit';
import {translate} from 'src/locales';
import {ApiRpc} from '@docknetwork/react-native-sdk/src/client/api-rpc';
import uuid from 'uuid';
import {getRealm} from 'src/core/realm';
import {showToast} from 'src/core/toast';
import {DOCK_TOKEN_UNIT} from 'src/core/format-utils';
import {appSelectors} from '../app/app-slice';
import {fetchTransactions} from '../../core/subscan';
import {accountSelectors} from '../accounts/account-slice';
import BigNumber from 'bignumber.js';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const TransactionStatus = {
  InProgress: 'pending',
  Failed: 'failed',
  Complete: 'complete',
};

const initialState = {
  loading: false,
  transactions: [],
  transactionFilter: 'all',
  groupedTransactions: {},
};

export const parseTransaction = transaction =>
  transaction.date instanceof Date
    ? transaction
    : {
        ...transaction,
        date: new Date(transaction.date),
      };

export const sortTransactions = (a, b) => b.date.getTime() - a.date.getTime();

export const startDate = date => {
  if (date instanceof Date) {
    const parsedDate = new Date(date.setHours(0, 0, 0));
    const fullYear = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    return `${fullYear}-${month}-${day}@0:0:0`;
  }
  return startDate(new Date());
};

export const endDate = date => {
  if (date instanceof Date) {
    const parsedDate = new Date(date.setHours(23, 59, 59));
    const fullYear = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    return `${fullYear}-${month}-${day}@23:59:59`;
  }
  return endDate(new Date());
};

const transactions = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTransactions(state, action) {
      state.transactions = action.payload.map(parseTransaction);
    },
    setTransactionFilter(state, action) {
      state.transactionFilter = action.payload;
    },
    setGroupedTransactions(state, action) {
      state.groupedTransactions = action.payload;
    },
    addTransaction(state, action) {
      state.transactions.push(parseTransaction(action.payload));
      state.transactions = state.transactions.sort(sortTransactions);
    },
    updateTransaction(state, action) {
      state.transactions = state.transactions.map(item => {
        if (item.id === action.payload.id) {
          return parseTransaction(action.payload);
        }

        return item;
      });
    },
  },
});

export const transactionsActions = transactions.actions;

const getRoot = state => state.transactions;

export const transactionsSelectors = {
  getLoading: state => getRoot(state).loading,
  getTransactions: state => getRoot(state).transactions,
  getGroupedTransactions: state => getRoot(state).groupedTransactions,
  getTransactionFilter: state => getRoot(state).transactionFilter,
};

export const transactionsOperations = {
  loadExternalTransactions: account => async (dispatch, getState) => {
    const realm = getRealm();
    const dbTransactions = realm.objects('Transaction').toJSON();

    const handleTransaction = tx => {
      if (tx.from !== account && tx.to !== account) {
        return;
      }

      if (dbTransactions.find(item => item.hash === tx.hash)) {
        return;
      }

      const newTx = {
        amount: BigNumber(tx.amount).times(DOCK_TOKEN_UNIT).toString(),
        feeAmount: tx.fee,
        recipientAddress: tx.to,
        fromAddress: tx.from,
        id: tx.hash,
        hash: tx.hash,
        network: 'mainnet',
        status: TransactionStatus.Complete,
        date: new Date(parseInt(tx.block_timestamp + '000', 10)),
      };

      realm.write(() => {
        realm.create('Transaction', newTx, 'modified');
      });
    };

    let data;
    let page = 0;

    try {
      do {
        data = await fetchTransactions({
          address: account,
          page,
        });
        if (Array.isArray(data.transfers)) {
          data.transfers.forEach(handleTransaction);
          page++;
        } else {
          break;
        }
      } while (data.hasNextPage);
    } catch (err) {
      console.log(err);
    }
  },
  loadTransactions:
    (accountAddress, realm = getRealm()) =>
    async (dispatch, getState) => {
      const networkId = appSelectors.getNetworkId(getState());
      const transactionFilter = transactionsSelectors.getTransactionFilter(
        getState(),
      );

      if (networkId === 'mainnet') {
        const accounts = accountSelectors.getAccounts(getState());
        for (const account of accounts) {
          try {
            await dispatch(
              transactionsOperations.loadExternalTransactions(account.id),
            );
          } catch (err) {
            console.error(err);
          }
        }
      }

      const today = new Date();
      const yesterday = new Date(today);

      yesterday.setDate(yesterday.getDate() - 1);

      let baseRealmResults = realm
        .objects('Transaction')
        .filtered(
          `(status == "${TransactionStatus.Complete}" AND hash !="") OR (status !="${TransactionStatus.Complete}")`,
        )
        .filtered(
          `fromAddress == "${accountAddress}" OR recipientAddress == "${accountAddress}"`,
        );

      const transactionDates = baseRealmResults.reduce(
        (result, transaction) => {
          const beginningDate = new Date(transaction.date).getTime();

          if (!result[beginningDate]) {
            result[beginningDate] = {
              start: startDate(new Date(transaction.date)),
              end: endDate(new Date(transaction.date)),
            };
          }
          return result;
        },
        {},
      );

      const groupedTransactions = {};
      for (const key in transactionDates) {
        const {start, end} = transactionDates[key];

        const todayRealTransaction = baseRealmResults
          .filtered(`date >=${start} AND date <=${end}`)
          .sorted('date', true)
          .toJSON();

        const beginningOfToday = startDate(today);
        const beginningOfYesterday = startDate(yesterday);
        const transactionDate = new Date(parseInt(key, 10));

        if (beginningOfToday === start) {
          groupedTransactions.Today =
            todayRealTransaction.map(parseTransaction);
        } else if (beginningOfYesterday === start) {
          groupedTransactions.Yesterday =
            todayRealTransaction.map(parseTransaction);
        } else {
          const fullYear = transactionDate.getFullYear();
          const month = transactionDate.getMonth();
          const day = transactionDate.getDate();

          const parsedDate = `${months[month]} ${day},${fullYear}`;
          groupedTransactions[parsedDate] =
            todayRealTransaction.map(parseTransaction);
        }
      }

      dispatch(transactionsActions.setGroupedTransactions(groupedTransactions));
    },
  updateTransaction: transaction => async (dispatch, getState) => {
    const realm = getRealm();

    realm.write(() => {
      realm.create('Transaction', transaction, 'modified');
    });

    dispatch(transactionsActions.updateTransaction(transaction));
  },

  getFeeAmount:
    ({recipientAddress, accountAddress, amount}) =>
    async (dispatch, getState) => {
      return ApiRpc.getFeeAmount({
        recipientAddress: recipientAddress,
        accountAddress,
        amount: amount,
      });
    },

  sendTransaction:
    ({recipientAddress, accountAddress, amount, fee, prevTransaction}) =>
    async (dispatch, getState) => {
      showToast({
        message: translate('send_token.transaction_sent'),
      });

      const parsedAmount = parseFloat(amount) * DOCK_TOKEN_UNIT;

      const internalId = uuid();
      const transaction = {
        id: internalId,
        date: new Date().toISOString(),
        fromAddress: accountAddress,
        recipientAddress: recipientAddress,
        amount: `${parsedAmount}`,
        feeAmount: `${fee}`,
        status: TransactionStatus.InProgress,
      };

      const realm = getRealm();

      realm.write(() => {
        realm.create('Transaction', transaction, 'modified');
      });

      dispatch(transactionsActions.addTransaction(transaction));

      showToast({
        type: 'success',
        message: translate('confirm_transaction.transfer_initiated'),
      });

      ApiRpc.sendTokens({
        recipientAddress,
        accountAddress,
        amount: parsedAmount,
      })
        .then(res => {
          const updatedTransation = {
            ...transaction,
            status: TransactionStatus.Complete,
          };
          dispatch(transactionsActions.updateTransaction(updatedTransation));

          realm.write(() => {
            realm.create('Transaction', updatedTransation, 'modified');
          });

          showToast({
            type: 'success',
            message: translate('confirm_transaction.transaction_complete'),
          });

          if (
            prevTransaction &&
            prevTransaction.status === TransactionStatus.Failed
          ) {
            dispatch(
              transactionsOperations.updateTransaction({
                ...prevTransaction,
                retrySucceed: true,
              }),
            );
          }
        })
        .catch(err => {
          console.error(err);

          showToast({
            type: 'error',
            message: translate('transaction_failed.title'),
          });

          const updatedTransation = {
            ...transaction,
            status: TransactionStatus.Failed,
          };

          realm.write(() => {
            realm.create('Transaction', updatedTransation, 'modified');
          });

          dispatch(transactionsActions.updateTransaction(updatedTransation));
        });
    },
};

export const transactionsReducer = transactions.reducer;
