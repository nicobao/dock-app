import {useDIDManagementHandlers} from './didHooks';
import {useCallback, useMemo, useState} from 'react';
import {authHandler} from '../qr-code-scanner/qr-code';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';

export function useDIDAuthHandlers() {
  const [profileData, setProfileData] = useState({});
  const [selectedDID, setSelectedDID] = useState();

  const handleChange = useCallback((key, value) => {
    if (key === 'did') {
      setSelectedDID(value);
    } else {
      setProfileData(prevState => ({
        ...prevState,
        [key]: value,
      }));
    }
  }, []);

  return useMemo(
    () => ({handleChange, profileData, selectedDID}),
    [handleChange, profileData, selectedDID],
  );
}

export function useDIDAuth() {
  const {didList} = useDIDManagementHandlers();
  const [authState, setAuthState] = useState('start');

  const handleRetry = useCallback(() => {
    setAuthState('start');
  }, []);

  const getSelectedDIDKeyDoc = useCallback(async ({selectedDID}) => {
    const correlationDocs = await walletService.resolveCorrelations(
      selectedDID,
    );
    const keyDoc = correlationDocs.find(
      document => document.type.indexOf('VerificationKey') !== -1,
    );
    if (keyDoc) {
      return keyDoc;
    }
    throw new Error('DID KeyDocument not found');
  }, []);
  const authenticateDID = useCallback(
    async ({dockWalletAuthDeepLink, selectedDID, profileData}) => {
      // TODO: should we store profileData relating to the website that requested it in wallet
      // so that we can prepopulate the fields next time?
      setAuthState('processing');
      const keydoc = await getSelectedDIDKeyDoc({selectedDID});
      const result = await authHandler(
        dockWalletAuthDeepLink,
        keydoc,
        profileData,
      );
      if (result) {
        setAuthState('completed');
        setTimeout(() => {
          navigate(Routes.ACCOUNTS);
        }, 3000);
      } else {
        setAuthState('error');
      }
    },
    [getSelectedDIDKeyDoc],
  );

  const dids = useMemo(() => {
    return didList.map(did => {
      return {
        value: did.id,
        label: did.name,
        description: did.didDocument?.id,
      };
    });
  }, [didList]);

  return useMemo(() => {
    return {
      dids,
      authState,
      handleRetry,
      authenticateDID,
      getSelectedDIDKeyDoc,
    };
  }, [dids, authState, handleRetry, authenticateDID, getSelectedDIDKeyDoc]);
}
