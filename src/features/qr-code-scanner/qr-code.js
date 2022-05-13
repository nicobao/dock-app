import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {showToast} from '../../core/toast';
import {translate} from '../../locales';
import {getJsonOrError} from '../../core';
import {DebugConstants} from '../constants';
import '../credentials/credentials';

export async function addressHandler(data) {
  const isAddress = await UtilCryptoRpc.isAddressValid(data);

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
      await credentials.add(credentialData);
    } else {
      const jsonData = JSON.parse(data);
      credentialData = await credentials.add(jsonData);
    }

    navigate(Routes.APP_CREDENTIALS);
    return true;
  } catch (err) {
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

export async function authHandler(data) {
  const authLinkPrefix = 'dockwallet://didauth?url=';
  const isAuthLink =
    typeof data === 'string' && data.indexOf(authLinkPrefix) === 0;

  if (isAuthLink) {
    const url =
      'https://' + decodeURIComponent(data.substr(authLinkPrefix.length));

    showToast({
      type: 'message',
      message: translate('global.auth_sign_in'),
    });

    try {
      // DEBUG: For internal testing we just submit a hardcoded credential
      // for production we will require the wallet to build and sign one
      const vc = DebugConstants.authCredential;
      const req = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          vc,
        }),
      });

      const result = await req.json();
      if (result.verified) {
        showToast({
          type: 'message',
          message: translate('global.auth_sign_in_success'),
        });
      } else {
        showToast({
          type: 'error',
          message: result.error || translate('global.auth_sign_in_failed'),
        });
      }
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        message: `Sign in error: ${e.message}`,
      });
    }
    return true;
  }

  return false;
}

export const qrCodeHandlers = [authHandler, addressHandler, credentialHandler];

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
