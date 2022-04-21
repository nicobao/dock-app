import {useEffect, useState} from 'react';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {pickJSONFile} from '../../core/storage-utils';
import {showToast} from 'src/core/toast';
import {translate} from 'src/locales';
import assert from 'assert';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';

export const sortByIssuanceDate = (a, b) =>
  getCredentialTimestamp(b) - getCredentialTimestamp(a);

export function getCredentialTimestamp(credential) {
  assert(!!credential, 'credential is required');

  if (!credential.issuanceDate) {
    return 0;
  }

  return new Date(credential.issuanceDate).getTime() || 0;
}

Credentials.getInstance().wallet = {
  add: async doc => {
    const result = {
      '@context': ['https://w3id.org/wallet/v1'],
      id: `credential-${Date.now()}`,
      ...doc,
    };

    await WalletRpc.add(result);

    return result;
  },
  query: params =>
    WalletRpc.query({
      equals: {
        'content.type': params.type,
      },
    }),
  remove: params => WalletRpc.remove(params),
};

export function useCredentials() {
  const [items, setItems] = useState([]);

  const syncCredentials = async () => {
    console.log('sync credentials');
    const credentials = await Credentials.getInstance().query();
    setItems(credentials.sort(sortByIssuanceDate));
  };

  useEffect(() => {
    syncCredentials();
  }, []);

  const handleRemove = async item => {
    await Credentials.getInstance().remove(item.id);
    await syncCredentials();
  };

  const onAdd = async () => {
    const jsonData = await pickJSONFile();

    if (!jsonData) {
      return;
    }

    try {
      await Credentials.getInstance().add(jsonData);
    } catch (err) {
      showToast({
        message: translate('credentials.invalid_credential'),
        type: 'error',
      });
    }
  };

  return {
    credentials: items,
    handleRemove,
    onAdd,
  };
}
