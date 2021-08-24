import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ReceiveTokenScreen} from './ReceiveTokenScreen';

const mockStore = configureMockStore();

describe('ReceiveTokensScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<ReceiveTokenScreen address={'3B9W5fS4ygoUVnGhzTk7sihSdhCyJQRNMQ7aJfDdsfWb16f1'} />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
