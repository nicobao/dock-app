import {useEffect, useState} from 'react';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {pickJSONFile} from '../../core/storage-utils';
import {showToast} from 'src/core/toast';
import {translate} from 'src/locales';

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

  console.log('credetials', items);
  return {
    credentials: items,
    handleRemove,
    onAdd,
  };
}
