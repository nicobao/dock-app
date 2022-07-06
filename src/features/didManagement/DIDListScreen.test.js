import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {DIDListScreen} from './DIDListScreen';

const mockStore = configureMockStore();

describe('DIDListScreen', () => {
  it('should render correctly ', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<DIDListScreen />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
