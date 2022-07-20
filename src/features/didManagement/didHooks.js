import {useCallback, useMemo, useState} from 'react';
import {showToast} from '../../core/toast';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {useDIDManagement} from '@docknetwork/wallet-sdk-react-native/lib';

export function useDIDManagementHandlers() {
  const {createKeyDID, deleteDID, editDID, didList} = useDIDManagement();
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
    const {derivationPath, didType, keypairType, didName} = form;

    try {
      const newDIDParams = {
        derivePath: derivationPath,
        didType,
        type: keypairType,
        name: didName,
      };
      await createKeyDID(newDIDParams);
      showToast({
        message: translate('didManagement.did_created'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_CREATED, {});
    } catch (e) {
      throw new Error(
        translate('didManagement.error_keypair_type', {
          keypairType,
        }),
      );
    }
  }, [createKeyDID, form]);

  const onDeleteDID = useCallback(
    async didResolution => {
      try {
        await deleteDID({id: didResolution.id});
        showToast({
          message: translate('didManagement.did_deleted'),
          type: 'success',
        });
      } catch (e) {}
    },
    [deleteDID],
  );

  const onEditDID = useCallback(async () => {
    const {id, didName} = form;

    try {
      await editDID({id, name: didName});
      showToast({
        message: translate('didManagement.did_edited_successfully'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_UPDATED, {});
    } catch (e) {
      showToast({
        message: translate('didManagement.did_updating_error'),
        type: 'error',
      });
      logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
        action: ANALYTICS_EVENT.DID.DID_UPDATED,
        ...form,
      });
      throw new Error(translate('didManagement.did_updating_error'));
    }
  }, [editDID, form]);
  return useMemo(() => {
    return {
      onCreateDID,
      form,
      handleChange,
      onEditDID,
      onDeleteDID,
      didList,
    };
  }, [onCreateDID, form, handleChange, onEditDID, onDeleteDID, didList]);
}
