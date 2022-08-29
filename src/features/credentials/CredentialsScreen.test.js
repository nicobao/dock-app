import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CredentialsScreen, CredentialListItem} from './CredentialsScreen';

const mockStore = configureMockStore();

describe('CredentialsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CredentialsScreen credentials={[]} onRemove={jest.fn} onAdd={jest.fn} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly credential list', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          dk: 'https://ld.dock.io/credentials#',
          EmployeeIDCredential: 'dk:EmployeeIDCredential',
          name: 'dk:name',
          email: 'dk:email',
          employeeId: 'dk:employeeId',
        },
      ],
      id: 'https://creds-testnet.dock.io/191ce57b4b9195d823937c016e31544c225279e4fb3e7d5ed88038acf5daac42',
      type: ['VerifiableCredential', 'EmployeeIDCredential'],
      credentialSubject: {
        name: 'Alice Doe',
        email: 'alice@dock.io',
        employeeId: 123456,
      },
      issuanceDate: '2022-08-29T15:24:47.799Z',
      name: 'Acme Employee ID',
      proof: {
        type: 'Ed25519Signature2018',
        created: '2022-08-29T16:24:47Z',
        verificationMethod:
          'did:dock:5D5K67AnGLBKSVJNkFW25uaDa7cSUjx6Zj55tzMdqQvQDPkA#keys-1',
        proofPurpose: 'assertionMethod',
        proofValue:
          'zYetMX6EPE1Lzqe92ZZopqFQrwN1g9wwXE2UHW6y69cDZQfoCkz7hMZDxURvo8fVW97p2f6tpAfWKEQU8RvRNPxC',
      },
      issuer: 'did:dock:5D5K67AnGLBKSVJNkFW25uaDa7cSUjx6Zj55tzMdqQvQDPkA',
    };
    const formattedData = {
      humanizedType: 'Employee I D Credential',
      title: 'Acme Employee ID',
      subjectName: 'Alice Doe',
      issuerName: 'did:dock:5D5K67AnGLBKSVJNkFW25uaDa7cSUjx6Zj55tzMdqQvQDPkA',
      date: 'August 29, 2022',
      image: null,
      images: {
        issuerImage: null,
        subjectImage: null,
        mainImage: null,
        imagesList: [],
      },
      documents: [[]],
      template: 'credential',
      qrImage: false,
      attributes: [
        {name: 'Name', property: 'name', value: 'Alice Doe'},
        {name: 'Email', property: 'email', value: 'alice@dock.io'},
        {name: 'Employee Id', property: 'employeeId', value: 123456},
      ],
      subjects: [
        {name: 'Alice Doe', email: 'alice@dock.io', employeeId: 123456},
      ],
      issuer: 'did:dock:5D5K67AnGLBKSVJNkFW25uaDa7cSUjx6Zj55tzMdqQvQDPkA',
      issuanceDate: '2022-08-29T15:24:47.799Z',
      expirationDateStr: '',
      dateStr: 'August 29, 2022',
    };
    const wrapper = shallow(
      <CredentialListItem
        credential={credential}
        formattedData={formattedData}
        onRemove={jest.fn}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
