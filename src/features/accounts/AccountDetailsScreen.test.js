import {shallow} from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import {
  AccountDetailsScreen,
  filterTransactionHistory,
} from './AccountDetailsScreen';
import {
  transactionsOperations,
  TransactionStatus,
} from '../transactions/transactions-slice';
import thunk from 'redux-thunk';
import Realm from 'realm';
import {Transaction} from '../../core/realm-schemas';

const mockStore = configureMockStore([thunk]);

const initMockRealm = () => {
  return Realm.open({
    path: 'dock_unit_test',
    schema: [Transaction],
    schemaVersion: 3,
    deleteRealmIfMigrationNeeded: false,
    inMemory: true,
    migration: () => {
      // No migration required so far
    },
  });
};

const initMockTransactions = () => {
  return [
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '0',
      hash: null,
      network: 'testnet',
      status: TransactionStatus.Complete,
      date: new Date('2022-03-01T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '1',
      hash: null,
      network: 'testnet',
      status: TransactionStatus.InProgress,
      date: new Date('2022-03-02T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '2',
      hash: null,
      network: 'testnet',
      status: TransactionStatus.Failed,
      date: new Date('2022-03-03T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '3',
      hash: '',
      network: 'testnet',
      status: TransactionStatus.Complete,
      date: new Date('2022-03-04T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '4',
      hash: '',
      network: 'testnet',
      status: TransactionStatus.InProgress,
      date: new Date('2022-03-05T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '5',
      hash: '',
      network: 'testnet',
      status: TransactionStatus.Failed,
      date: new Date('2022-03-06T17:52:03.741Z'),
    },

    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '6',
      hash: '0xa3b3bf9d13dd726c1e0051d48cb99fd05e79442b2cda05374e898351c3ade9c2',
      network: 'testnet',
      status: TransactionStatus.Complete,
      date: new Date('2022-03-07T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '7',
      hash: '0xc3b3bf9d13dd726c1e0051d48cb99fd05e79442b2cda05374e898351c3ade9c2',
      network: 'testnet',
      status: TransactionStatus.InProgress,
      date: new Date('2022-03-08T17:52:03.741Z'),
    },
    {
      amount: '10',
      feeAmount: '1',
      recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      fromAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
      id: '8',
      hash: '0xb3b3bf9d13dd726c1e0051d48cb99fd05e79442b2cda05374e898351c3ade9c2',
      network: 'testnet',
      status: TransactionStatus.Failed,
      date: new Date('2022-03-09T17:52:03.741Z'),
    },
  ];
};

describe('AccountDetailsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <AccountDetailsScreen
        account={{
          meta: {
            name: 'Test account',
            balance: 0,
          },
        }}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  describe('expect transactions to be retrieved in desc order', () => {
    let store;
    let realm;
    beforeEach(async () => {
      realm = await initMockRealm();
      for (const tx of initMockTransactions()) {
        await realm.write(() => {
          realm.create('Transaction', tx, 'modified');
        });
      }

      const initialState = {
        app: {
          networkId: 'testnet',
          devSettingsEnabled: true,
        },
        wallet: {},
        account: {},
        createAccount: {},
        qrCode: {},
        transactions: {
          transactions: [],
        },
      };
      store = mockStore(initialState);
    });
    afterEach(() => {
      realm.write(() => {
        realm.deleteAll();
      });
      realm.close();
    });
    it('Is history filtered', async () => {
      return store
        .dispatch(transactionsOperations.loadTransactions(realm))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0].payload.length).toEqual(8);
        });
    });

    it('Is history sorted', async () => {
      return store
        .dispatch(transactionsOperations.loadTransactions(realm))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0].payload[7].id).toEqual('0');
          expect(actions[0].payload[6].id).toEqual('1');
          expect(actions[0].payload[5].id).toEqual('2');
          expect(actions[0].payload[4].id).toEqual('4');
          expect(actions[0].payload[3].id).toEqual('5');
          expect(actions[0].payload[2].id).toEqual('6');
          expect(actions[0].payload[1].id).toEqual('7');
          expect(actions[0].payload[0].id).toEqual('8');
        });
    });
  });
  describe('expect to filter transaction history items', () => {
    const address1 = '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB';
    const address2 = '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB';
    const txSent = {
      amount: '1',
      fromAddress: address1,
      recipientAddress: address2,
      status: 'complete',
    };
    const txReceived = {
      amount: '1',
      fromAddress: address2,
      recipientAddress: address1,
      status: 'complete',
    };
    const txReceivedFailed = {
      amount: '1',
      fromAddress: address2,
      recipientAddress: address1,
      status: 'failed',
    };
    const txOtherAddress = {
      amount: '1',
      fromAddress: 'someOtherAddress',
      recipientAddress: 'someOtherAddress',
      status: 'complete',
    };

    it('expect to hide received transactions with failed status', () => {
      const transactions = filterTransactionHistory(
        [txReceived, txReceivedFailed],
        address1,
      );
      expect(transactions.length).toBe(1);
    });

    it('expect to add sent flag', () => {
      const transactions = filterTransactionHistory(
        [txReceived, txSent],
        address1,
      );
      expect(transactions[0].sent).toBe(false);
      expect(transactions[1].sent).toBe(true);
    });

    it('expect to filter only transactions for the given address', () => {
      const transactions = filterTransactionHistory(
        [txOtherAddress, txSent],
        address1,
      );
      expect(transactions.length).toBe(1);
    });
  });
});
