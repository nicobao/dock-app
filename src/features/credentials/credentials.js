import React, {useCallback, useEffect, useState} from 'react';
import {getVCData} from '@docknetwork/prettyvc';
import {pickJSONFile} from '../../core/storage-utils';
import {withErrorToast} from 'src/core/toast';
import {translate} from 'src/locales';
import assert from 'assert';
import {credentialServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/credential';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import queryString from 'query-string';
import {captureException} from '@sentry/react-native';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';
import {useCredentialUtils} from '@docknetwork/wallet-sdk-react-native/lib';
import {showConfirmationModal} from '../../components/ConfirmationModal';
import {
  getCredentialStatus,
  CREDENTIAL_STATUS,
} from '@docknetwork/wallet-sdk-react-native/lib';
import {
  ExpiredIcon,
  InvalidIcon,
  RevokedIcon,
  VerifiedIcon,
} from '../../assets/icons';
import {Theme} from '../../design-system';
const wallet = Wallet.getInstance();

export function getDIDAddress(issuer) {
  if (typeof issuer === 'string') {
    return issuer.replace(/did:\w+:/gi, '');
  } else if (typeof issuer?.id === 'string') {
    return issuer.id.replace(/did:\w+:/gi, '');
  }
  return null;
}

export async function formatCredential(credential) {
  assert(!!credential, 'Credential is required');
  assert(!!credential.content, 'credential.content is required');
  assert(
    !!credential.content.credentialSubject,
    'credential.content.credentialSubject is required',
  );

  const formattedData = await getVCData(credential.content, {
    generateImages: false,
    generateQRImage: false,
  });
  if (formattedData.issuanceDate) {
    const issuanceDate = new Date(formattedData.issuanceDate);
    const userTimezoneOffset = issuanceDate.getTimezoneOffset() * 60000;
    formattedData.issuanceDate = new Date(
      issuanceDate.getTime() + userTimezoneOffset,
    );
  }

  return {
    ...credential,
    formattedData,
  };
}
export const validateCredential = credential => {
  assert(
    typeof credential !== 'undefined',
    translate('credentials.invalid_credential'),
  );
  assert(
    typeof credential?.id === 'string',
    translate('credentials.credential_no_id'),
  );
  assert(
    credential.hasOwnProperty('@context') === true,
    translate('credentials.credential_no_context'),
  );

  assert(
    credential.type?.includes('VerifiableCredential'),
    translate('credentials.credential_no_type'),
  );
  assert(
    !credential.type?.includes('EncryptedWallet'),
    translate('credentials.credential_no_type'),
  );
  assert(
    !credential.type?.includes('UniversalWallet2020'),
    translate('credentials.credential_no_type'),
  );
  assert(
    typeof credential?.issuer?.id === 'string' ||
      typeof credential?.issuer === 'string',
    translate('credentials.credential_no_issuer'),
  );
};
export function useCredentials({onPickFile = pickJSONFile} = {}) {
  const {credentials, saveCredential, deleteCredential} = useCredentialUtils();
  const [items, setItems] = useState([]);

  const syncCredentials = useCallback(async () => {
    const formattedCredentials = await Promise.all(
      credentials.map(formatCredential),
    );
    setItems(formattedCredentials);
  }, [credentials]);

  useEffect(() => {
    syncCredentials();
  }, [syncCredentials]);

  const handleRemove = async item => {
    await deleteCredential(item.id);
  };

  const onAdd = async () => {
    const jsonData = await onPickFile();

    if (!jsonData) {
      return;
    }
    validateCredential(jsonData);
    const status = await getCredentialStatus(jsonData);

    if (status === CREDENTIAL_STATUS.VERIFIED) {
      return saveCredential(jsonData);
    }
    showConfirmationModal({
      type: 'alert',
      title: translate('credentials.import_credential'),
      description: credentialStatusData[status].description,
      confirmText: translate('navigation.ok'),
      cancelText: translate('navigation.cancel'),
      onConfirm: async () => {
        await saveCredential(jsonData);
      },
    });
  };

  return {
    credentials: items,
    handleRemove: withErrorToast(handleRemove),
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

export const credentialStatusData = {
  [CREDENTIAL_STATUS.INVALID]: {
    message: translate('credentials.invalid'),
    description: translate('credentials.import_invalid_credential_desc'),
    icon: <InvalidIcon />,
    color: Theme.colors.errorText,
  },
  [CREDENTIAL_STATUS.EXPIRED]: {
    message: translate('credentials.expired'),
    description: translate('credentials.import_expired_credential_desc'),
    icon: <ExpiredIcon />,
    color: Theme.colors.warningText,
  },
  [CREDENTIAL_STATUS.REVOKED]: {
    message: translate('credentials.revoked'),
    description: translate('credentials.import_revoked_credential_desc'),
    icon: <RevokedIcon />,
    color: Theme.colors.errorText,
  },
  [CREDENTIAL_STATUS.VERIFIED]: {
    message: translate('credentials.valid'),
    description: '',
    icon: <VerifiedIcon />,
    color: Theme.colors.circleChecked,
  },
};
