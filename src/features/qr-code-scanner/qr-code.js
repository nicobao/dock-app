import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';

export async function addressHandler(data) {
  const isAddress = await UtilCryptoRpc.isAddressValid(data);

  if (isAddress) {
    navigate(Routes.TOKEN_SEND, {
      address: data,
    });
    return true;
  }

  return false;
}

export async function credentialHandler(data) {
  try {
    // @ts-ignore
    const credentials: Credentials = Credentials.getInstance();

    let credentialData;

    if (data.indexOf('http') === 0) {
      credentialData = await credentials.getCredentialFromUrl(data);
      await credentials.add(credentialData);
    } else {
      const jsonData = JSON.parse(data);
      credentialData = await credentials.add(jsonData);
    }

    navigate(Routes.APP_CREDENTIALS);
    return true;
  } catch (err) {
    return false;
  }
}

export const qrCodeHandlers = [addressHandler, credentialHandler];

export async function qrCodeHandler(data, handlers = qrCodeHandlers) {
  for (const handler of handlers) {
    if (await handler(data)) {
      return;
    }
  }
}
