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
  it('should render correctly credential list with string issuer', () => {
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
  it('should render correctly credential list with issuer object', () => {
    const initialState = {
      // placeholder for redux store
    };

    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          dk: 'https://ld.dock.io/credentials#',
          UniversityDegreeCredential: 'dk:UniversityDegreeCredential',
          degree: 'dk:degree',
          name: 'dk:name',
          dateEarned: 'dk:dateEarned',
          person: 'dk:person',
          fullName: 'dk:fullName',
          dateOfBirth: 'dk:dateOfBirth',
          description: 'dk:description',
          logo: 'dk:logo',
        },
      ],
      id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      credentialSubject: {
        degree: {
          name: 'Degree Name',
          type: 'Degree Type',
          dateEarned: '2000-09-24',
        },
        person: {fullName: 'Full Name', dateOfBirth: '2000-09-24'},
        id: 'john',
      },
      issuanceDate: '2022-06-27T11:08:30.675Z',
      expirationDate: '2029-06-26T23:00:00.000Z',
      proof: {
        type: 'Ed25519Signature2018',
        created: '2022-06-27T12:09:34Z',
        verificationMethod:
          'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N#keys-1',
        proofPurpose: 'assertionMethod',
        proofValue:
          'zVVh5QYsUJR3GNBCKTU3dc2JknTQTrTcXqNJWFCcUb7iGx9iaRZgMUmkJhUF9nRaF5tqz6B2xjnzyWF9p7XNpy4L',
      },
      issuer: {
        name: 'John',
        description: '',
        logo: '',
        id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
      },
    };
    const formattedData = {
      humanizedType: 'University Degree Credential',
      title: 'University Degree Credential',
      subjectName: 'Degree Name',
      issuerName: 'John',
      date: 'June 27, 2022',
      image: null,
      images: {
        issuerImage: null,
        subjectImage: null,
        mainImage: null,
        imagesList: [],
      },
      documents: [
        [
          {name: 'Degree Name', type: 'Degree Type', dateEarned: '2000-09-24'},
          {fullName: 'Full Name', dateOfBirth: '2000-09-24'},
        ],
      ],
      template: 'diploma',
      qrImage: false,
      attributes: [
        {name: 'Degree name', property: 'degree name', value: 'Degree Name'},
        {name: 'Degree type', property: 'degree type', value: 'Degree Type'},
        {
          name: 'Degree date Earned',
          property: 'degree dateEarned',
          value: '2000-09-24',
        },
        {
          name: 'Person full Name',
          property: 'person fullName',
          value: 'Full Name',
        },
        {
          name: 'Person date Of Birth',
          property: 'person dateOfBirth',
          value: '2000-09-24',
        },
        {name: 'Id', property: 'id', value: 'osinakayah'},
      ],
      subjects: [
        {
          degree: {
            name: 'Degree Name',
            type: 'Degree Type',
            dateEarned: '2000-09-24',
          },
          person: {fullName: 'Full Name', dateOfBirth: '2000-09-24'},
          id: 'john',
        },
      ],
      issuer: {
        name: 'Ossy',
        description: '',
        logo: '',
        id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
      },
      issuanceDate: '2022-06-27T11:08:30.675Z',
      expirationDate: '2029-06-26T23:00:00.000Z',
      expirationDateStr: 'June 27, 2029',
      dateStr: 'June 27, 2022',
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
