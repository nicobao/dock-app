import {useCallback, useEffect, useMemo, useState} from 'react';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {
  createNewDID,
  deleteDIDDocument,
  updateDIDDocument,
} from './didManagment-slice';
import {showToast} from '../../core/toast';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
const wallet = Wallet.getInstance();

export function useDIDManagementHandlers() {
  const {queryDIDDocuments} = useDIDManagement();
  const [form, setForm] = useState({
    didName: '',
    didType: '',
    showDIDDockQuickInfo: true,
    keypairType: 'ed25519',
    derivationPath: '',
    _errors: {
      didType: '',
    },
    _hasError: false,
  });

  const handleChange = useCallback(key => {
    return evt => {
      setForm(v => ({
        ...v,
        [key]: evt,
      }));
    };
  }, []);

  const onCreateDID = useCallback(async () => {
    try {
      const {derivationPath, didType, keypairType, didName} = form;

      const newDIDParams = {
        derivePath: derivationPath,
        didType,
        type: keypairType,
        name: didName,
      };

      await createNewDID(newDIDParams);
      showToast({
        message: translate('didManagement.did_created'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_CREATED, {});
    } catch (e) {
      showToast({
        message: translate('didManagement.did_creation_error'),
        type: 'error',
      });
    }
  }, [form]);

  const onEditDID = useCallback(async () => {
    const {id, didName} = form;
    await updateDIDDocument(id, {
      name: didName,
    });
    navigate(Routes.DID_MANAGEMENT_LIST);
    showToast({
      message: translate('didManagement.did_edited_successfully'),
      type: 'success',
    });
  }, [form]);
  return useMemo(() => {
    return {
      onCreateDID,
      form,
      handleChange,
      onEditDID,
    };
  }, [onCreateDID, form, handleChange, onEditDID]);
}
export function useDIDManagement() {
  const [didList, setDIDList] = useState([]);

  const queryDIDDocuments = useCallback(async () => {
    const didResolutionDocuments = await wallet.query({
      type: 'DIDResolutionResponse',
    });
    console.log(didResolutionDocuments.length, 'didResolutionDocuments.length');
    setDIDList(didResolutionDocuments);
  }, []);

  useEffect(() => {
    queryDIDDocuments();
  }, [queryDIDDocuments]);

  const onDeleteDID = useCallback(
    async didResolution => {
      await deleteDIDDocument(didResolution.id);
      queryDIDDocuments();
      showToast({
        message: translate('didManagement.did_deleted'),
        type: 'success',
      });
    },
    [queryDIDDocuments],
  );

  return useMemo(() => {
    return {
      didList,
      queryDIDDocuments,
      onDeleteDID,
    };
  }, [didList, queryDIDDocuments, onDeleteDID]);
}
