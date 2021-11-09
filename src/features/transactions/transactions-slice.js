import {createSlice} from '@reduxjs/toolkit';
import {translate} from 'src/locales';
import {ApiRpc} from '@docknetwork/react-native-sdk/src/client/api-rpc';
import uuid from 'uuid';
import {getRealm} from 'src/core/realm';
import {showToast} from 'src/core/toast';
import {DOCK_TOKEN_UNIT} from 'src/core/format-utils';
import { appSelectors } from '../app/app-slice';
import {fetchTransactions} from '../../core/subscan';
import { accountSelectors } from '../accounts/account-slice';

export const TransactionStatus = {
  InProgress: 'pending',
  Failed: 'failed',
  Complete: 'complete',
};

const initialState = {
  loading: false,
  transactions: [],
};

const transactions = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
    addTransaction(state, action) {
      state.transactions.push(action.payload);
    },
    updateTransaction(state, action) {
      state.transactions = state.transactions.map(item => {
        if (item.id === action.payload.id) {
          return action.payload;
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
};

export const transactionsOperations = {
  loadTransactions: () => async (dispatch, getState) => {
    const realm = getRealm();
    const networkId = appSelectors.getNetworkId(getState());
    let items = realm.objects('Transaction').toJSON();

    // fetch transactions from subscan

    if (networkId === 'mainnet') {
      const accounts = accountSelectors.getAccounts(getState());

      for (const account of accounts) {
        const data = await fetchTransactions({ address: account.id });
        const txList = [];
        data.data.transfers.forEach(tx => {
          if (tx.from !== account.id && tx.to !== account.id) {
            return;
          }

          if (items.find(item => item.hash === tx.hash)) {
            return;
          }

          realm.write(() => {
            realm.create('Transaction', {
              amount: tx.amount,
              feeAmount: tx.fee,
              recipientAddress: tx.to,
              fromAddress: tx.from,
              id: tx.hash,
              hash: tx.hash, 
              network: 'mainnet',
              status: 'complete',
              date: new Date(parseInt(tx.block_timestamp + '000')),
            }, 'modified');
          });
        });
      }
    }

    items = realm.objects('Transaction').toJSON();
    dispatch(transactionsActions.setTransactions(items));
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
