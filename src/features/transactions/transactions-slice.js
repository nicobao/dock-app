import {createSlice} from '@reduxjs/toolkit';
import {translate} from 'src/locales';
import {substrateService} from '@docknetwork/wallet-sdk-core/lib/services/substrate';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {Transactions} from '@docknetwork/wallet-sdk-transactions/lib/transactions';
import uuid from 'uuid';
import {getRealm} from '@docknetwork/wallet-sdk-core/lib/core/realm';
import {showToast, withErrorToast} from 'src/core/toast';
import {DOCK_TOKEN_UNIT} from 'src/core/format-utils';
import {fetchTransactions} from '../../core/subscan';
import BigNumber from 'bignumber.js';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';

export const TransactionStatus = {
  InProgress: 'pending',
  Failed: 'failed',
  Complete: 'complete',
};

const initialState = {
  loading: false,
  transactions: [],
};

export const parseTransaction = transaction =>
  transaction.date instanceof Date
    ? transaction
    : {
        ...transaction,
        date: new Date(transaction.date),
      };

export const sortTransactions = (a, b) => b.date.getTime() - a.date.getTime();

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
};

export function getTransactionQuery(internalId) {
  return `hash == "${internalId}" OR id == "${internalId}"`;
}
export function deleteLocalTransaction(internalId) {
  const realm = getRealm();
  realm.write(() => {
    const realmTransaction = realm
      .objects('Transaction')
      .filtered(getTransactionQuery(internalId));
    realm.delete(realmTransaction);
  });
}
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
      const items = await Transactions.getInstance().loadTransactions(
        accountAddress,
      );

      dispatch(transactionsActions.setTransactions(items));
    },
  updateTransaction: transaction => async (dispatch, getState) => {
    const realm = getRealm();

    realm.write(() => {
      realm.create('Transaction', transaction, 'modified');
    });

    dispatch(transactionsActions.updateTransaction(transaction));
  },

  getFeeAmount: ({recipientAddress, accountAddress, amount}) =>
    withErrorToast(async (dispatch, getState) => {
      return substrateService.getFeeAmount({
        toAddress: recipientAddress,
        fromAddress: accountAddress,
        amount: amount,
      });
    }, translate('send_token.transaction_fee_error')),

  sendTransaction:
    ({
      recipientAddress,
      accountAddress,
      amount,
      fee,
      prevTransaction,
      sendMax,
    }) =>
    async (dispatch, getState) => {
      showToast({
        message: translate('send_token.transaction_sent'),
      });

      const parsedAmount = amount;

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
      substrateService
        .sendTokens({
          toAddress: recipientAddress,
          fromAddress: accountAddress,
          transferAll: sendMax,
          amount: parsedAmount,
        })
        .then(res => {
          [recipientAddress, accountAddress].forEach(address => {
            Wallet.getInstance().accounts.fetchBalance(address);
          });

          const updatedTransation = {
            ...transaction,
            status: TransactionStatus.Complete,
          };
          dispatch(transactionsActions.updateTransaction(updatedTransation));

          deleteLocalTransaction(internalId);

          showToast({
            type: 'success',
            message: translate('confirm_transaction.transaction_complete'),
          });
          logAnalyticsEvent(ANALYTICS_EVENT.TOKENS.SEND_TOKEN, {
            transactionId: internalId,
            date: new Date().toISOString(),
            fromAddress: accountAddress,
            recipientAddress: recipientAddress,
            amount: `${parsedAmount}`,
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

          logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
            name: ANALYTICS_EVENT.TOKENS.SEND_TOKEN,
            transactionId: internalId,
            date: new Date().toISOString(),
            fromAddress: accountAddress,
            recipientAddress: recipientAddress,
            amount: `${parsedAmount}`,
          });
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
