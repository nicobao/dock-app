import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {SingleDIDCreationPaymentAccount} from './SingleDIDCreationPaymentAccount';
import {renderAppProviders} from '../../../core/test-utils';

const mockStore = configureMockStore();

describe('SingleDIDCreationPaymentAccount', () => {
  it('should render correctly ', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      renderAppProviders(
        <SingleDIDCreationPaymentAccount
          item={{
            value: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
            label: 'Test Account',
            description: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
            balance: '0.01',
            fetchBalance: jest.fn(),
          }}
        />,
      ),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
