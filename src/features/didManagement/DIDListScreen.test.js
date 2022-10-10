import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {DIDListScreen} from './DIDListScreen';

const mockStore = configureMockStore();

describe('DIDListScreen', () => {
  it('should render correctly without list', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <DIDListScreen didList={[]} onDeleteDID={jest.fn()} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render correctly with list', () => {
    const initialState = {
      // placeholder for redux store
    };

    const didList = [
      {
        id: '1657822960364',
        type: 'DIDResolutionResponse',
        didDocument: {
          '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://ns.did.ai/transmute/v1',
            {
              '@base':
                'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
            },
          ],
          id: 'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
          verificationMethod: [
            {
              id: '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
              type: 'JsonWebKey2020',
              controller:
                'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
              publicKeyJwk: {
                crv: 'Ed25519',
                x: 'vGur-MEOrN6GDLf4TBGHDYAERxkmWOjTbztvG3xP0I8',
                kty: 'OKP',
              },
            },
            {
              id: '#z6LScrLMVd9jvbphPeQkGffSeB99EWSYqAnMg8rGiHCgz5ha',
              type: 'JsonWebKey2020',
              controller:
                'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
              publicKeyJwk: {
                kty: 'OKP',
                crv: 'X25519',
                x: 'EXXinkMxdA4zGmwpOOpbCXt6Ts6CwyXyEKI3jfHkS3k',
              },
            },
          ],
          authentication: ['#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg'],
          assertionMethod: [
            '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
          ],
          capabilityInvocation: [
            '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
          ],
          capabilityDelegation: [
            '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
          ],
          keyAgreement: ['#z6LScrLMVd9jvbphPeQkGffSeB99EWSYqAnMg8rGiHCgz5ha'],
        },
        correlation: [],
      },
    ];
    const wrapper = shallow(
      <DIDListScreen didList={didList} onDeleteDID={jest.fn()} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
