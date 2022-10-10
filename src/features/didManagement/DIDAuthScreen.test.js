import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {DIDAuthScreen, DIDAuthConfirmScreen} from './DIDAuthScreen';

const mockStore = configureMockStore();

describe('QRScanScreen', () => {
  it('should render DIDAuthScreen correctly ', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<DIDAuthScreen authState={'start'} />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render DIDAuthConfirmScreen ', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <DIDAuthConfirmScreen
        {...{
          authenticateDID: jest.fn(),
          profileData: {},
          dids: [],
          selectedDID: null,
          clientInfo: {
            name: 'Unnamed App',
            website: 'test.com',
            scope: 'public',
          },
          handleChange: jest.fn(),
        }}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
