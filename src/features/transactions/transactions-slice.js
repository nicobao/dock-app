import {createSlice} from '@reduxjs/toolkit';
import {Toast} from 'native-base';
import { translate } from 'src/locales';
import {navigateBack} from '../../core/navigation';
import {ApiRpc} from '../../rn-rpc-webview/api-rpc';

const TransactionStatus = {
  InProgress: 'pending',
  Failed: 'falied',
  Complete: 'complete',
};

const initialState = {
  loading: false,
  transactions: [{
    
  }],
};

const transactions = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const transactionsActions = transactions.actions;

const getRoot = state => state.transactions;

export const transactionsSelectors = {
  getLoading: state => getRoot(state).loading,
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const transactionsOperations = {
  getFeeAmount: ({
    recipientAddress,
    accountAddress,
    amount,
  }) =>
  async (dispatch, getState) => {
    return ApiRpc.getFeeAmount({
      address: addressTo,
      accountAddress,
      amount: amount,
    });
  },

  sendTransaction:
    ({
      recipientAddress,
      accountAddress,
      amount
    }) =>
    async (dispatch, getState) => {
      // create tx and add to the queue
      Toast.show({
        text: 'Transaction sent!',
      });

      try {
        ApiRpc.sendTokens({
          address: addressTo,
          accountAddress,
          amount: amount,
        }).then(() => {
          
        })
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'danger',
          text: translate(''),
        });
      }
    },
};

export const transactionsReducer = transactions.reducer;
