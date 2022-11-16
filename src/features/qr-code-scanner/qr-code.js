import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {showToast} from '../../core/toast';
import {translate} from '../../locales';
import {getJsonOrError} from '../../core';
import '../credentials/credentials';
import {
  credentialStatusData,
  onScanAuthQRCode,
  validateCredential,
} from '../credentials/credentials';
import {captureException} from '@sentry/react-native';
import queryString from 'query-string';
import store from '../../core/redux-store';
import {createAccountOperations} from '../account-creation/create-account-slice';
import {stringToJSON} from '../../core/storage-utils';
import {
  getCredentialStatus,
  CREDENTIAL_STATUS,
} from '@docknetwork/wallet-sdk-react-native/lib';
import {showConfirmationModal} from '../../components/ConfirmationModal';
import axios from '../../core/network-service';

export async function addressHandler(data) {
  const isAddress = await utilCryptoService.isAddressValid(data);

  if (isAddress) {
    navigate(Routes.TOKEN_SEND, {
      address: data,
    });
    return true;
  }

  console.log('not an address', data);
  return false;
}

export async function credentialHandler(data) {
  const isUrl = typeof data === 'string' && data.indexOf('http') === 0;

  try {
    // @ts-ignore
    const credentials: Credentials = Credentials.getInstance();

    let credentialData;
    if (isUrl) {
      showToast({
        type: 'message',
        message: translate('global.fetching_data'),
      });
      credentialData = await credentials.getCredentialFromUrl(data);
    } else {
      credentialData = JSON.parse(data);
    }

    const items = await credentials.query({});

    if (
      credentialData.id &&
      items.find(item => item.content && item.content.id === credentialData.id)
    ) {
      showToast({
        message: translate('credentials.existing_credential'),
        type: 'error',
      });

      return true;
    }

    validateCredential(credentialData);
    const status = await getCredentialStatus(credentialData);
    if (status === CREDENTIAL_STATUS.VERIFIED) {
      await credentials.add(credentialData);
      navigate(Routes.APP_CREDENTIALS);
      return true;
    }
    showConfirmationModal({
      type: 'alert',
      title: translate('credentials.import_credential'),
      description: credentialStatusData[status].description,
      confirmText: translate('navigation.ok'),
      cancelText: translate('navigation.cancel'),
      onConfirm: async () => {
        await credentials.add(credentialData);
        navigate(Routes.APP_CREDENTIALS);
      },
    });

    return true;
  } catch (err) {
    console.error(err);

    if (isUrl) {
      console.error(`Unable to resolve url: ${data}`);
    } else {
      const jsonOrError = getJsonOrError(data);

      if (typeof jsonOrError === 'string') {
        console.error(`Unable to resolve json: ${jsonOrError}`);
      } else {
        console.error(jsonOrError);
      }
    }

    console.error(err);
    return false;
  }
}
export function onPresentationScanned(url) {
  if (isDeepLinkType(url, 'dockwallet://proof-request?url=')) {
    navigate(Routes.CREDENTIALS_SHARE_AS_PRESENTATION, {
      deepLinkUrl: url,
    });
    return true;
  }
  return false;
}
export function onAuthQRScanned(data) {
  const isAuthLink = isDidAuthUrl(data);
  if (isAuthLink) {
    navigate(Routes.APP_DID_AUTH, {
      dockWalletAuthDeepLink: data,
    });
    return true;
  }
  return false;
}
export async function authHandler(data, keyDoc, profile = {}) {
  try {
    const authLinkPrefix = 'dockwallet://didauth?url=';
    const isAuthLink = isDidAuthUrl(data);
    if (isAuthLink) {
      showToast({
        type: 'message',
        message: translate('auth.auth_sign_in'),
      });
      const url = decodeURIComponent(data.substr(authLinkPrefix.length));

      const vc = await onScanAuthQRCode(url, keyDoc, profile);
      const response = await axios.post(
        url,
        JSON.stringify({
          vc,
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );
      const result = response.data;

      if (result.verified) {
        showToast({
          type: 'message',
          message: translate('auth.auth_sign_in_success'),
        });
        return true;
      } else {
        showToast({
          type: 'error',
          message: result.error || translate('auth.auth_sign_in_failed'),
        });
        captureException(result);
        return false;
      }
    }
    return false;
  } catch (e) {
    showToast({
      type: 'error',
      message: `Sign in error: ${e.message}`,
    });
    captureException(e);
    return false;
  }
}
export async function importAccountHandler(data) {
  const parsedData = stringToJSON(data);

  if (
    parsedData &&
    parsedData.hasOwnProperty('encoded') &&
    parsedData.hasOwnProperty('address')
  ) {
    store.dispatch(createAccountOperations.importFromJson(data));
    return true;
  }
  return false;
}
export async function onScanEncryptedWallet(data) {
  const parsedData = stringToJSON(data);
  if (
    parsedData &&
    Array.isArray(parsedData.type) &&
    parsedData.type.includes('EncryptedWallet')
  ) {
    navigate(Routes.DID_MANAGEMENT_IMPORT_DID, {
      encryptedJSONWallet: parsedData,
    });
    return true;
  }
  return false;
}
export const qrCodeHandlers = [
  onScanEncryptedWallet,
  importAccountHandler,
  onAuthQRScanned,
  addressHandler,
  credentialHandler,
  onPresentationScanned,
];

export async function executeHandlers(data, handlers) {
  if (!data || !handlers) {
    return false;
  }

  for (const handler of handlers) {
    if (await handler(data)) {
      return true;
    }
  }

  return false;
}

export async function qrCodeHandler(data, handlers = qrCodeHandlers) {
  const success = await executeHandlers(data, handlers);

  if (!success) {
    showToast({
      type: 'error',
      message: translate('qr_scanner.not_supported_data'),
    });
  }
}

export function isDidAuthUrl(url) {
  return isDeepLinkType(url, 'dockwallet://didauth?url=');
}
export function isDeepLinkType(url, prefix) {
  return typeof url === 'string' && url.indexOf(prefix) === 0;
}
export function getParamsFromUrl(url) {
  return queryString.parse(url.substring(url.indexOf('?')));
}
