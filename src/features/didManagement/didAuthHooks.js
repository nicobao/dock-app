import {useDIDManagementHandlers} from './didHooks';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {authHandler} from '../qr-code-scanner/qr-code';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';
import {useWallet} from '@docknetwork/wallet-sdk-react-native/lib';

export const DID_AUTH_METADATA_ID = 'did-auth-metadata';

export function useDIDAuthHandlers() {
  const [profileData, setProfileData] = useState({
    empty: true,
  });
  const [selectedDID, setSelectedDID] = useState();
  const {wallet} = useWallet({syncDocs: false});

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

  useEffect(() => {
    if (!profileData.empty) {
      return;
    }

    wallet.getDocumentById(DID_AUTH_METADATA_ID).then(data => {
      setProfileData(data?.value || {});
    });
  }, [wallet, profileData]);

  return useMemo(
    () => ({handleChange, profileData, selectedDID}),
    [handleChange, profileData, selectedDID],
  );
}

export function useDIDAuth() {
  const {didList} = useDIDManagementHandlers();
  const [authState, setAuthState] = useState('start');
  const {wallet} = useWallet({syncDocs: false});

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
      wallet.upsert({
        id: DID_AUTH_METADATA_ID,
        type: 'Metadata',
        value: profileData,
      });
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
    [getSelectedDIDKeyDoc, wallet],
  );

  const dids = useMemo(() => {
    return didList.map(did => {
      return {
        value: did.id,
        label:
          typeof did.name === 'string' && did.name.length > 0
            ? did.name
            : did.didDocument?.id,
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
