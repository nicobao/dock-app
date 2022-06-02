import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {didServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/dids';

const wallet = Wallet.getInstance();

const createKeyDoc = () => {
  return didServiceRPC.generateKeyDoc({});
};
const createDID = async keyDoc => {
  const correlations = Array.isArray(keyDoc.correlation)
    ? keyDoc.correlation
    : [];

  const {didDocument} = await didServiceRPC.keypairToDIDKeyDocument({
    keypairDoc: keyDoc,
  });

  const didDocumentResolution = await didServiceRPC.getDIDResolution({
    didDocument,
  });

  correlations.push(didDocumentResolution.id);
  await wallet.add({
    ...didDocumentResolution,
  });
  await wallet.update({
    ...keyDoc,
    correlation: correlations,
  });
};

const initializeDID = async () => {
  const keyDocs = await wallet.query({
    type: 'Ed25519VerificationKey2018',
  });

  if (keyDocs.length > 0) {
    const didResolutionDocuments = await wallet.query({
      type: 'DIDResolutionResponse',
    });

    if (didResolutionDocuments.length === 0) {
      await createDID(keyDocs[0]);
    }
  } else if (keyDocs.length === 0) {
    const keyDoc = await createKeyDoc();
    await wallet.add({
      ...keyDoc,
    });

    await initializeDID();
  }
};

export const didOperations = {
  initializeDID: () => async (dispatch, getState) => {
    await initializeDID();
  },
};
