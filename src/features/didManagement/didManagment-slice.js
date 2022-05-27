import uuid from 'uuid';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';

export const didOperations = {
  createDID: () => async (dispatch, getState) => {
    const wallet = Wallet.getInstance();

    const didResolutionDocuments = await wallet.query({
      type: 'DIDResolutionResponse',
    });
    if (didResolutionDocuments.length === 0) {
      const keyDocs = await wallet.query({
        type: 'Ed25519VerificationKey2018',
      });
      if (keyDocs.length > 0) {
        //TODO include DID into correlation of keyDoc
        const keyDoc = keyDocs[0];

        console.log(keyDoc);
      }
    }

    // WalletRpc.query({
    //   equals: {
    //     'content.type': 'KeyringPair',
    //   },
    // });
  },
  initializeDiDs: () => async (dispatch, getState) => {
    const d = await DidRpc.createDIDFromMnemonic({
      mnemonic:
        'zoo cotton detail parade inflict helmet ladder topple toilet invite garden online',
    });
    console.log(d);
    return;
    const existingDiDs = await WalletRpc.query({
      equals: {
        'content.type': 'DID',
      },
    });

    if (existingDiDs.length === 0) {
      const keyPair = await DidRpc.createDidKeyPair();

      const keypairDocument = {
        '@context': ['https://w3id.org/wallet/v1'],
        id: `key-${uuid()}`,
        type: 'KEY',
        ...keyPair,
      };
      await WalletRpc.add(keypairDocument);

      const didDocument = await DidRpc.createDID({keyPair: keypairDocument});

      await WalletRpc.add({
        '@context': ['https://w3id.org/wallet/v1'],
        id: `did-${uuid()}`,
        type: 'DID',
        ...didDocument,
      });
    }
  },
};
