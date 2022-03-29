import {useEffect, useState} from 'react';
import testCredential from './test-credential.json';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
export function useCredentials() {
  const [items, setItems] = useState([]);

  const syncCredentials = async () => {
    const credentials = await Credentials.getInstance().query();
    setItems(credentials);
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
