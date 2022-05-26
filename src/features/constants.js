export const GlobalConstants = {
  navigation: {
    testID: {
      next: 'navigation.next',
      back: 'navigation.back',
      skip: 'navigation.skip',
    },
  },
};

export const DebugConstants = {
  authCredential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        dk: 'https://ld.dock.io/credentials#',
        DockAuthCredential: 'dk:DockAuthCredential',
        name: 'dk:name',
        email: 'dk:email',
        state: 'dk:state',
        description: 'dk:description',
        logo: 'dk:logo',
      },
    ],
    id: 'didauth:dock:clientid',
    type: ['VerifiableCredential', 'DockAuthCredential'],
    credentialSubject: {
      name: 'John Doe',
      email: 'test@dock.io',
      state: 'debugstate',
    },
    issuanceDate: '2022-04-01T18:26:21.637Z',
    expirationDate: '2023-04-01T18:26:21.637Z',
    proof: {
      type: 'Ed25519Signature2018',
      created: '2022-05-13T17:57:12Z',
      verificationMethod:
        'did:dock:5FbQXJULrLt8kymWe4ScrM2MyRWAweYXCQ79EpL7ADUV2H8Y#keys-1',
      proofPurpose: 'assertionMethod',
      proofValue:
        'z4ndjdQcqyypWAdtmRcz8KRh6cMzQCuDrQfq4fwa7WdANtxjsXje8UN7Pc16w1DDYNWdrWuV75bWvd6H2VDYfG1qB',
    },
    issuer: {
      name: 'Auth Test',
      description: 'test',
      logo: '',
      id: 'did:dock:5FbQXJULrLt8kymWe4ScrM2MyRWAweYXCQ79EpL7ADUV2H8Y',
    },
  },
};
