import {createSlice} from '@reduxjs/toolkit';
import {Toast} from 'native-base';
import {translate} from 'src/locales';
import {ApiRpc} from '../../rn-rpc-webview/api-rpc';
import uuid from 'uuid';
import {navigateBack} from '../../core/navigation';
import {getRealm} from 'src/core/realm';

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
    const items = realm.objects('Transaction').toJSON();
    dispatch(transactionsActions.setTransactions(items));
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
    ({recipientAddress, accountAddress, amount}) =>
    async (dispatch, getState) => {
      Toast.show({
        text: translate('send_token.transaction_sent'),
      });

      const internalId = uuid();
      const transaction = {
        recipientAddress,
        accountAddress,
        amount,
        internalId,
        status: TransactionStatus.InProgress,
      };

      dispatch(transactionsActions.addTransaction(transaction));

      Toast.show({
        type: 'success',
        text: translate('confirm_transaction.transfer_initiated'),
      });

      ApiRpc.sendTokens({
        address: recipientAddress,
        accountAddress,
        amount: amount,
      })
        .then(() => {
          dispatch(
            transactionsActions.updateTransaction({
              ...transaction,
              status: TransactionStatus.Complete,
            }),
          );

          Toast.show({
            type: 'success',
            text: translate('confirm_transaction.transaction_complete'),
          });
        })
        .catch(err => {
          Toast.show({
            type: 'danger',
            text: translate('transaction_failed.title'),
          });

          dispatch(
            transactionsActions.updateTransaction({
              ...transaction,
              status: TransactionStatus.Failed,
            }),
          );
        });
    },
};

export const transactionsReducer = transactions.reducer;
