import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CredentialStatus} from './CredentialStatus';
import {renderAppProviders} from '../../../core/test-utils';

const mockStore = configureMockStore();

describe('CredentialsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      credentialSubject: {},
      issuanceDate: '2022-06-27T12:08:30.675Z',
      expirationDate: '2039-06-26T23:00:00.000Z',
      issuer: {
        name: 'John Doe',
        description: '',
        logo: '',
        id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
      },
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
