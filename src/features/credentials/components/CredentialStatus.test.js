import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CredentialStatus} from './CredentialStatus';
import {renderAppProviders} from '../../../core/test-utils';
import * as credentialUtils from '@docknetwork/wallet-sdk-react-native/lib';

const mockStore = configureMockStore();

describe('CredentialsScreen', () => {
  it('should render correctly when invalid', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      id: 1,
      status: credentialUtils.CREDENTIAL_STATUS.INVALID,
    };
    const wrapper = shallow(
      renderAppProviders(<CredentialStatus credential={credential} />),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly when expired', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      id: 1,
      status: credentialUtils.CREDENTIAL_STATUS.EXPIRED,
    };
    const wrapper = shallow(
      renderAppProviders(<CredentialStatus credential={credential} />),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly when verified', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      id: 1,
      status: credentialUtils.CREDENTIAL_STATUS.VERIFIED,
    };
    const wrapper = shallow(
      renderAppProviders(<CredentialStatus credential={credential} />),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly when revoked', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      id: 1,
      status: credentialUtils.CREDENTIAL_STATUS.REVOKED,
    };
    const wrapper = shallow(
      renderAppProviders(<CredentialStatus credential={credential} />),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
