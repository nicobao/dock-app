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
      renderAppProviders(<SingleDIDCreationPaymentAccount item={{}} />),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
