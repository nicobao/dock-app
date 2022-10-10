import {useAccounts} from '@docknetwork/wallet-sdk-react-native/lib';
import {useMemo} from 'react';

export function useAccountsList() {
  const {accounts: rawAccounts} = useAccounts();

  const accounts = useMemo(() => {
    if (Array.isArray(rawAccounts)) {
      return [...rawAccounts].reverse();
    }
    return [];
  }, [rawAccounts]);

  return useMemo(() => {
    return {
      accounts,
    };
  }, [accounts]);
}
