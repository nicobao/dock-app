import {getRealm} from '@docknetwork/wallet-sdk-core/lib/core/realm';
import {
  getTransactionQuery,
  parseTransaction,
  sortTransactions,
  transactionsOperations,
} from './transactions-slice';
import {substrateService} from '@docknetwork/wallet-sdk-core/lib/services/substrate';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {initRealm} from '@docknetwork/wallet-sdk-core/lib/core/realm';

const mockStore = configureMockStore([thunk]);
describe('transactions-slice', () => {
  beforeAll(initRealm);

  it('expect to parse transaction', () => {
    const t1 = {
      date: new Date(),
    };

    const t2 = {
      date: new Date().toString(),
    };

    expect(parseTransaction(t1)).toBe(t1);
    expect(parseTransaction(t2).date).toBeInstanceOf(Date);
  });

  it('expect to sort transactions', () => {
    const baseTime = Date.now();
    const t1 = {
      date: new Date(baseTime + 1000),
    };

    const t2 = {
      date: new Date(baseTime + 2000),
    };

    const t3 = {
      date: new Date(baseTime + 3000),
    };

    const t4 = {
      date: new Date(baseTime + 4000),
    };

    const list = [t2, t1, t3, t4];
    const sorted = list.sort(sortTransactions);

    expect(sorted[0]).toBe(t4);
    expect(sorted[1]).toBe(t3);
    expect(sorted[2]).toBe(t2);
    expect(sorted[3]).toBe(t1);
  });

  it('Test if realm delete is called', () => {
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
        loading: false,
        transactions: [],
      },
    };

    const store = mockStore(initialState);

    const realm = getRealm();

    expect(getTransactionQuery('testUUid')).toBe(
      'hash == "testUUid" OR id == "testUUid"',
    );

    return store
      .dispatch(
        transactionsOperations.sendTransaction({
          recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
          accountAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
          amount: 1,
          fee: 1,
        }),
      )
      .then(() => {
        expect(realm.delete.mock.calls.length).toBe(1);
      });
  });

  it('expect to sendTransaction', async () => {
    const dispatch = () => {};
    const getState = () => {};

    const spy = jest.spyOn(substrateService, 'sendTokens');

    spy.mockImplementation(() => Promise.resolve({}));

    const form = {
      recipientAddress: 'address',
      accountAddress: 'address2',
      amount: 1,
      sendMax: true,
    };

    await transactionsOperations.sendTransaction(form)(dispatch, getState);

    expect(substrateService.sendTokens).toBeCalledWith({
      toAddress: form.recipientAddress,
      fromAddress: form.accountAddress,
      transferAll: form.sendMax,
      amount: form.amount,
    });
  });
});
