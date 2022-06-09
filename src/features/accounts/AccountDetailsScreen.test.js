import {shallow} from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import {
  AccountDetailsScreen,
  filterTransactionHistory,
} from './AccountDetailsScreen';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

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
  });
});
