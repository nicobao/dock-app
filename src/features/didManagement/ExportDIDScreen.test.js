import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ExportDIDScreen} from './ExportDIDScreen';

const mockStore = configureMockStore();

describe('ExportDIDScreen', () => {
  it('should render correctly ', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<ExportDIDScreen />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
