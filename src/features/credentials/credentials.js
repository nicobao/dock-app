import {useEffect, useState} from 'react';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {getVCData} from '@docknetwork/prettyvc';
import {pickJSONFile} from '../../core/storage-utils';
import {showToast, withErrorToast} from 'src/core/toast';
import {translate} from 'src/locales';
import assert from 'assert';
import {credentialServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/credential';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import queryString from 'query-string';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {captureException} from '@sentry/react-native';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';

const wallet = Wallet.getInstance();

export function doesCredentialExist(allCredentials, credentialToAdd) {
  return !!allCredentials.find(item => item.content.id === credentialToAdd.id);
}

export const sortByIssuanceDate = (a, b) =>
  getCredentialTimestamp(b.content) - getCredentialTimestamp(a.content);

export function getCredentialTimestamp(credential) {
  assert(!!credential, 'credential is required');

  if (!credential.issuanceDate) {
    return 0;
  }

  return new Date(credential.issuanceDate).getTime() || 0;
}

// TODO: Investigate why WalletRpc is not working properly for this calls
// This proxy should not be required and must be handled by the wallet sdk
// Credentials.getInstance().wallet = {
//   add: async doc => {
//     const result = {
//       '@context': ['https://w3id.org/wallet/v1'],
//       id: `credential-${Date.now()}`,
//       ...doc,
//     };

//     await WalletRpc.add(result);

//     return result;
//   },
//   query: params =>
//     WalletRpc.query({
//       equals: {
//         'content.type': params.type,
//       },
//     }),
//   remove: params => WalletRpc.remove(params),
// };

export function getDIDAddress(did) {
  assert(!!did, 'did is required');

  return did.replace(/did:\w+:/gi, '');
}

export async function processCredential(credential) {
  assert(!!credential, 'Credential is required');
  assert(!!credential.content, 'credential.content is required');
  assert(
    !!credential.content.credentialSubject,
    'credential.content.credentialSubject is required',
  );

  if (credential.content.issuanceDate) {
    const issuanceDate = new Date(credential.content.issuanceDate);
    const userTimezoneOffset = issuanceDate.getTimezoneOffset() * 60000;
    credential.content.issuanceDate = new Date(
      issuanceDate.getTime() + userTimezoneOffset,
    );
  }

  const formattedData = await getVCData(credential.content, {
    generateImages: false,
    generateQRImage: false,
  });

  return {
    ...credential,
    formattedData,
  };
}
const validateCredential = credential => {
  assert(
    typeof credential !== 'undefined',
    translate('credentials.invalid_credential') + 0,
  );
  assert(
    typeof credential?.id === 'string',
    translate('credentials.invalid_credential') + 1,
  );
  assert(
    credential.hasOwnProperty('@context') === true,
    translate('credentials.invalid_credential') + 2,
  );

  assert(
    credential.type.includes('VerifiableCredential'),
    translate('credentials.invalid_credential') + 4,
  );
  assert(
    credential?.issuer?.hasOwnProperty('id') === true,
    translate('credentials.invalid_credential') + 5,
  );
};
export function useCredentials({onPickFile = pickJSONFile} = {}) {
  const [items, setItems] = useState([]);

  const syncCredentials = async () => {
    const credentials = await Credentials.getInstance().query();

    const processedCredentials = await Promise.all(
      credentials.sort(sortByIssuanceDate).map(processCredential),
    );

    setItems(processedCredentials);
  };

  useEffect(() => {
    syncCredentials();
  }, []);

  const handleRemove = async item => {
    await Credentials.getInstance().remove(item.id);
    await syncCredentials();
  };

  const onAdd = async () => {
    const jsonData = await onPickFile();

    if (!jsonData) {
      return;
    }
    validateCredential(jsonData);
    try {
      if (doesCredentialExist(items, jsonData)) {
        showToast({
          message: translate('credentials.existing_credential'),
          type: 'error',
        });
        return;
      }
      await Credentials.getInstance().add(jsonData);
      await syncCredentials();
      logAnalyticsEvent(ANALYTICS_EVENT.CREDENTIALS.IMPORT);
    } catch (err) {
      showToast({
        message: translate('credentials.invalid_credential'),
        type: 'error',
      });
      logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
        name: ANALYTICS_EVENT.CREDENTIALS.IMPORT,
      });
    }
  };

  return {
    credentials: items,
    handleRemove,
    onAdd: withErrorToast(onAdd),
  };
}
export function getParamsFromUrl(url, param) {
  const startOfQueryParams = url.indexOf('?');

  const parsed = queryString.parse(url.substring(startOfQueryParams));
  return parsed[param] ? parsed[param] : '';
}

export async function getOwnedDIDs() {
  try {
    const didResolutionDocuments = await wallet.query({
      type: 'DIDResolutionResponse',
    });

    const keyPairs = await Promise.all(
      didResolutionDocuments.map(async didDoc => {
        const correlationDocs = await walletService.resolveCorrelations(
          didResolutionDocuments[0].id,
        );
        const keyDoc = correlationDocs.find(
          document => document.type.indexOf('VerificationKey') !== -1,
        );
        return (
          keyDoc && {
            didDoc,
            keyDoc,
          }
        );
      }),
    );

    return keyPairs.filter(r => !!r);
  } catch (e) {
    console.error(e);
    captureException(e);
    throw new Error(e.message);
  }
}

// The issuer (the assigner) is prohibiting verifiers (the assignee) from storing the data in an archive.
function generatePolicyNoArchiveStore(id, assigner) {
  return {
    type: 'IssuerPolicy',
    id: 'https://ld.dock.io/policies/credential/1',
    prohibition: [
      {
        assigner,
        assignee: 'AllVerifiers',
        target: id,
        action: ['Archival'],
      },
    ],
  };
}

export function generateAuthVC({controller}, credentialSubject) {
  assert(!!controller);
  assert(!!credentialSubject);
  const AUTHCRED_EXPIRY_MINS = 10;
  const expirationDate = new Date(
    new Date().getTime() + AUTHCRED_EXPIRY_MINS * 60000,
  );
  const id = `didauth:${credentialSubject.state}`;
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        dk: 'https://ld.dock.io/credentials#',
        DockAuthCredential: 'dk:DockAuthCredential',
        name: 'dk:name',
        email: 'dk:email',
        state: 'dk:state',
        IssuerPolicy: 'dk:IssuerPolicy',
        AllVerifiers: 'dk:AllVerifiers',
        Archival: 'dk:Archival',
        prohibition: 'dk:prohibition',
        action: 'dk:action',
        assignee: 'dk:assignee',
        assigner: 'dk:assigner',
        target: 'dk:target',
      },
    ],
    termsOfUse: [generatePolicyNoArchiveStore(id, controller)],
    id,
    type: ['VerifiableCredential', 'DockAuthCredential'],
    credentialSubject,
    expirationDate: expirationDate.toISOString(),
  };
}

export async function onScanAuthQRCode(url, keyDoc, profile) {
  if (keyDoc) {
    try {
      const verifiableCredential = generateAuthVC(keyDoc, {
        ...profile,
        state: getParamsFromUrl(url, 'id'),
      });
      return credentialServiceRPC.signCredential({
        vcJson: verifiableCredential,
        keyDoc,
      });
    } catch (e) {
      captureException(e);
      throw new Error(e.message);
    }
  } else {
    throw new Error(translate('qr_scanner.no_key_doc'));
  }
}
