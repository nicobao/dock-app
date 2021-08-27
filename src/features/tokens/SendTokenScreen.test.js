import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {SendTokenScreen} from './SendTokenScreen';

const mockStore = configureMockStore();

describe('SendTokenScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <SendTokenScreen
        address={'3B9W5fS4ygoUVnGhzTk7sihSdhCyJQRNMQ7aJfDdsfWb16f1'}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
