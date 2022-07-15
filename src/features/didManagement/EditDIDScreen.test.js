import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {EditDIDScreen} from './EditDIDScreen';

const mockStore = configureMockStore();

describe('EditDIDScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didName: '',
      didType: 'diddock',
      showDIDDockQuickInfo: true,
      keypairType: 'ed25519',
      derivationPath: '',
      _errors: {
        didType: '',
      },
      _hasError: false,
    };

    const wrapper = shallow(
      <EditDIDScreen
        handleChange={jest.fn()}
        form={form}
        handleSubmit={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly when button is not enable', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didName: 'Name',
      didType: 'diddock',
      showDIDDockQuickInfo: true,
      keypairType: 'ed25519',
      derivationPath: '',
      _errors: {
        didType: '',
      },
      _hasError: false,
    };

    const wrapper = shallow(
      <EditDIDScreen
        handleChange={jest.fn()}
        form={form}
        handleSubmit={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
