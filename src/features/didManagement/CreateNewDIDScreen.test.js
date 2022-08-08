import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateNewDIDScreen} from './CreateNewDIDScreen';

const mockStore = configureMockStore();

const accounts = [
  {
    value: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
    label: 'Test Account',
    description: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
  },
];
describe('CreateNewDIDScreen', () => {
  it('should render correctly when form is invalid', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didName: '',
      didType: 'didkey',
      showDIDDockQuickInfo: false,
      keypairType: 'ed25519',
      derivationPath: '',
      _errors: {
        didType: '',
      },
      _hasError: false,
    };
    const wrapper = shallow(
      <CreateNewDIDScreen
        isFormValid={false}
        accounts={[]}
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
  it('should render correctly when form is valid', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didName: 'Default',
      didType: 'didkey',
      showDIDDockQuickInfo: false,
      keypairType: 'ed25519',
      derivationPath: '',
      _errors: {
        didType: '',
      },
      _hasError: false,
    };
    const wrapper = shallow(
      <CreateNewDIDScreen
        isFormValid={true}
        accounts={[]}
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

  it('should render correctly with modal', () => {
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
      <CreateNewDIDScreen
        isFormValid={true}
        accounts={accounts}
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
