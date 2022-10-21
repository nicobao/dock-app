import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {BuildIdentifier} from './BuildIdentifier';

const mockStore = configureMockStore();

describe('BuildIdentifier', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<BuildIdentifier onUnlock={jest.fn()} />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
