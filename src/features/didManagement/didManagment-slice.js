import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {didServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/dids';
import {captureException} from '@sentry/react-native';

const wallet = Wallet.getInstance();

const createKeyDoc = () => {
  return didServiceRPC.generateKeyDoc({});
};
const createDID = async keyDoc => {
  try {
    const correlations = Array.isArray(keyDoc.correlation)
      ? keyDoc.correlation
      : [];

    const {didDocument} = await didServiceRPC.keypairToDIDKeyDocument({
      keypairDoc: keyDoc,
    });

    const didDocumentResolution = await didServiceRPC.getDIDResolution({
      didDocument,
    });

    didDocumentResolution.correlation.push(keyDoc.id);

    correlations.push(didDocumentResolution.id);
    await wallet.add({
      ...didDocumentResolution,
    });
    await wallet.update({
      ...keyDoc,
      correlation: correlations,
    });
  } catch (e) {
    captureException(e);
  }
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
    try {
      const keyDoc = await createKeyDoc();
      await wallet.add({
        ...keyDoc,
      });

      await initializeDID();
    } catch (e) {
      captureException(e);
    }
  }
};

export const didOperations = {
  initializeDID: () => async (dispatch, getState) => {
    await initializeDID();
  },
};
