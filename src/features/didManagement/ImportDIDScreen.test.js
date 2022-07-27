import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ImportDIDScreen} from './ImportDIDScreen';

const mockStore = configureMockStore();

describe('ImportDIDScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didName: '',
      didType: '',
      password: '',
      showDIDDockQuickInfo: true,
      keypairType: 'ed25519',
      derivationPath: '',
      _errors: {
        didType: '',
      },
      _hasError: false,
    };
    const encryptedJSONWallet = {};
    const wrapper = shallow(
      <ImportDIDScreen
        form={form}
        handleChange={jest.fn()}
        handleSubmit={jest.fn()}
        encryptedJSONWallet={encryptedJSONWallet}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
