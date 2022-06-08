import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {DIDAuthScreen} from './DIDAuthScreen';

const mockStore = configureMockStore();

describe('QRScanScreen', () => {
  it('should render correctly when isScreenFocus=true', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<DIDAuthScreen authState={'start'} />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
