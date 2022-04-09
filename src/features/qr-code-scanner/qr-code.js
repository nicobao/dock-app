import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {showToast} from '../../core/toast';
import {translate} from '../../locales';
import {getJsonOrError} from '../../core';

// Credentials.getInstance().wallet = {
//   add: async doc => {
//     const result = {
//       '@context': ['https://w3id.org/wallet/v1'],
//       id: `credential-${Date.now()}`,
//       ...doc,
//     };
//
//     await WalletRpc.add(result);
//
//     return result;
//   },
//   query: params =>
//     WalletRpc.query({
//       equals: {
//         'content.type': params.type,
//       },
//     }),
// };

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

export const qrCodeHandlers = [addressHandler, credentialHandler];

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
