import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {UnlockWalletScreen} from './UnlockWalletScreen';
import {
  authenticationReducer,
  authenticationActions,
} from './unlock-wallet-slice';

const mockStore = configureMockStore();

describe('UnlockWalletScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<UnlockWalletScreen biometry={true} />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});

describe('Test Authentication', function () {
  it('should return the initial state', () => {
    expect(authenticationReducer(undefined, {})).toEqual({
      isLoggedIn: false,
    });
  });

  it('should handle auth state change', () => {
    const previousState = {
      isLoggedIn: false,
    };
    expect(
      authenticationReducer(
        previousState,
        authenticationActions.setAuth({isLoggedIn: true}),
      ),
    ).toEqual({
      isLoggedIn: true,
    });
  });
});
