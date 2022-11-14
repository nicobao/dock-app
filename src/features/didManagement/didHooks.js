import {useCallback, useEffect, useMemo, useState} from 'react';
import {showToast, withErrorToast} from '../../core/toast';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {
  useDIDManagement,
  useDIDUtils,
} from '@docknetwork/wallet-sdk-react-native/lib';
import RNFS from 'react-native-fs';
import {exportFile} from '../accounts/account-slice';
import {useDIDAuth} from './didAuthHooks';
import {useWallet} from '@docknetwork/wallet-sdk-react-native/lib';

export function useDIDManagementHandlers() {
  const {
    createDID,
    deleteDID,
    editDID,
    didList: rawDIDList,
    importDID,
    exportDID,
  } = useDIDManagement();
  const [form, setForm] = useState({
    didName: '',
    didType: '',
    password: '',
    showDIDDockQuickInfo: true,
    didPaymentAddress: '',
    keypairType: 'ed25519',
    derivationPath: '',
    _errors: {
      didType: '',
    },
    _hasError: false,
  });

  const isFormValid = useMemo(() => {
    if (form.didType === 'didkey') {
      return form.didType.length > 0 && form.didName.trim().length > 0;
    } else if (form.didType === 'diddock') {
      return (
        form.didType.length > 0 &&
        form.didName.trim().length > 0 &&
        form.didPaymentAddress
      );
    }
    return false;
  }, [form.didName, form.didPaymentAddress, form.didType]);

  const didList = useMemo(() => {
    if (Array.isArray(rawDIDList)) {
      return [...rawDIDList].reverse();
    }
    return [];
  }, [rawDIDList]);
  const onImportDID = useCallback(
    async ({encryptedJSONWallet, password}) => {
      try {
        await importDID({encryptedJSONWallet, password});
      } catch (e) {
        switch (e.message) {
          case 'Incorrect password':
            throw new Error(translate('didManagement.invalid_did_password'));
          case 'DID already exist in wallet':
            throw new Error(translate('didManagement.duplicate_did'));
          default:
            throw new Error(translate('didManagement.invalid_did_file'));
        }
      }
      showToast({
        message: translate('didManagement.did_imported_successfully'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_IMPORTED, {});
    },
    [importDID],
  );
  const handleChange = useCallback(key => {
    return evt => {
      setForm(v => ({
        ...v,
        [key]: evt,
      }));
    };
  }, []);

  const onCreateDID = useCallback(async () => {
    const {derivationPath, didType, keypairType, didName, didPaymentAddress} =
      form;
    const newDIDParams = {
      derivePath: derivationPath,
      didType,
      type: keypairType,
      name: didName,
      address: didPaymentAddress,
    };

    await createDID(newDIDParams);

    showToast({
      message: translate('didManagement.did_created'),
      type: 'success',
    });
    navigate(Routes.DID_MANAGEMENT_LIST);
    logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_CREATED, {});
  }, [createDID, form]);

  const onDeleteDID = useCallback(
    async didResolution => {
      await deleteDID({id: didResolution.id});
      showToast({
        message: translate('didManagement.did_deleted'),
        type: 'success',
      });
    },
    [deleteDID],
  );

  const onEditDID = useCallback(async () => {
    const {id, didName} = form;

    await editDID({id, name: didName});
    showToast({
      message: translate('didManagement.did_edited_successfully'),
      type: 'success',
    });
    navigate(Routes.DID_MANAGEMENT_LIST);
    logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_UPDATED, {});
  }, [editDID, form]);

  const onExportDID = useCallback(
    async ({id, password}) => {
      const res = await exportDID({id, password});

      const encryptedWalletJSONStr =
        typeof res === 'string' ? res : JSON.stringify(res);

      const fileName = `did_${id.replace(/:/g, '-')}`;
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}.json`;
      const mimeType = 'application/json';
      await RNFS.writeFile(path, encryptedWalletJSONStr);

      exportFile({
        path,
        mimeType,
        errorMessage: translate('didManagement.export_error'),
      });
      showToast({
        message: translate('didManagement.did_exported'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_EXPORTED, {});
    },
    [exportDID],
  );
  return useMemo(() => {
    return {
      onCreateDID: withErrorToast(onCreateDID),
      form,
      handleChange,
      onEditDID: withErrorToast(onEditDID),
      onDeleteDID: withErrorToast(onDeleteDID),
      onImportDID: withErrorToast(onImportDID),
      onExportDID: withErrorToast(onExportDID),
      didList,
      isFormValid,
    };
  }, [
    onCreateDID,
    form,
    handleChange,
    onEditDID,
    onDeleteDID,
    onImportDID,
    onExportDID,
    didList,
    isFormValid,
  ]);
}

export function useExportDIDHandlers() {
  const [form, setForm] = useState({
    password: '',
    passwordConfirmation: '',
    _errors: {},
    _hasError: false,
  });
  const formValid = useMemo(() => {
    return (
      form.password &&
      form.passwordConfirmation &&
      form.caseValidation &&
      form.specialCharactersValidation &&
      form.digitsValidation &&
      form.passwordMatchValidation &&
      form.lengthValidation
    );
  }, [
    form.caseValidation,
    form.digitsValidation,
    form.lengthValidation,
    form.password,
    form.passwordConfirmation,
    form.passwordMatchValidation,
    form.specialCharactersValidation,
  ]);

  const handleChange = useCallback(
    key => {
      return value => {
        const updatedForm = {
          ...form,
          [key]: value,
        };

        if (key === 'password') {
          updatedForm.lengthValidation = value.length >= 8;
          updatedForm.digitsValidation = /\d/.test(value);
          updatedForm.caseValidation =
            /[A-Z]/.test(value) && /[a-z]/.test(value);
          updatedForm.specialCharactersValidation = /\W/.test(value);
        }

        updatedForm.passwordMatchValidation =
          updatedForm.password === updatedForm.passwordConfirmation &&
          updatedForm.password.length > 0;

        setForm(v => ({
          ...v,
          ...updatedForm,
        }));
      };
    },
    [form],
  );
  return useMemo(() => {
    return {
      form,
      handleChange,
      formValid,
    };
  }, [form, handleChange, formValid]);
}

export function useSingleDID(dids, onSelectDID) {
  useEffect(() => {
    if (dids.length === 1) {
      onSelectDID(dids[0].value);
    }
  }, [dids, onSelectDID]);
}

export function useMigrateInvalidKeyDocs() {
  const {wallet} = useWallet({syncDocs: true});
  const {createDIDKeypairDocument} = useDIDUtils();
  const {didList} = useDIDManagementHandlers();
  const {getSelectedDIDKeyDoc} = useDIDAuth();

  const migrateInvalidKeyDoc = useCallback(async () => {
    const dockDIDs = didList.filter(({id}) => {
      return typeof id === 'string' && id.startsWith('did:dock:');
    });

    for (const did of dockDIDs) {
      const keyDoc = await getSelectedDIDKeyDoc({selectedDID: did.id});

      if (keyDoc && keyDoc.controller.startsWith('did:key:')) {
        const newKeyDoc = await createDIDKeypairDocument({
          derivePath: '',
          type: 'ed25519',
          controller: did.id,
        });
        const oldCorrelation = did.correlation;
        const newCorrelation = oldCorrelation.filter(corrId => {
          return corrId !== keyDoc.id;
        });
        newCorrelation.push(newKeyDoc.id);

        await wallet.remove(keyDoc.id);
        await wallet.add(newKeyDoc);
        await wallet.update({
          ...did,
          correlation: newCorrelation,
        });
      }
    }
  }, [createDIDKeypairDocument, didList, getSelectedDIDKeyDoc, wallet]);

  return useMemo(() => {
    return {
      migrateInvalidKeyDoc,
    };
  }, [migrateInvalidKeyDoc]);
}
