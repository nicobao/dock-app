import {useEffect, useState} from 'react';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import assert from 'assert';

export const sortByIssuanceDate = (a, b) =>
  getCredentialTimestamp(b) - getCredentialTimestamp(a);

export function getCredentialTimestamp(credential) {
  assert(!!credential, 'credential is required');

  if (!credential.issuanceDate) {
    return 0;
  }

  return new Date(credential.issuanceDate).getTime() || 0;
}

export function useCredentials() {
  const [items, setItems] = useState([]);

  const syncCredentials = async () => {
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

  return {
    credentials: items,
    handleRemove,
  };
}
