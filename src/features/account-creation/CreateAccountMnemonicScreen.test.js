import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {
  CreateAccountMnemonicScreen,
  enableScreenShot,
  preventScreenShot,
} from './CreateAccountMnemonicScreen';
import ScreenCaptureSecure from 'react-native-screen-capture-secure';

const mockStore = configureMockStore();

describe('CreateAccountMnemonicScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateAccountMnemonicScreen phrase="test phrase" />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('expect screenshot to be enabled', () => {
    enableScreenShot();
    expect(ScreenCaptureSecure.disableSecure).toBeCalled();
  });

  it('expect screenshot to be disabled', () => {
    preventScreenShot();
    expect(ScreenCaptureSecure.enableSecure).toBeCalled();
  });
});
