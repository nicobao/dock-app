import {useCallback, useMemo, useState} from 'react';
import {showToast, withErrorToast} from '../../../core/toast';
import {usePresentation} from '@docknetwork/wallet-sdk-react-native/lib';
import {useDIDAuth} from '../../didManagement/didAuthHooks';
import {getParamsFromUrl} from '../../qr-code-scanner/qr-code';
import {translate} from '../../../locales';
import {navigate} from '../../../core/navigation';
import {Routes} from '../../../core/routes';
export const SELECT_CREDENTIALS = 0;
export const SELECT_DID = 1;
export function useCredentialPresentation(deepLinkUrl) {
  const [step, setStep] = useState(SELECT_CREDENTIALS);
  const [selectedCredentials, setSelectedCredentials] = useState({});
  const [selectedDID, onSelectDID] = useState();
  const {presentCredentials} = usePresentation();

  const {getSelectedDIDKeyDoc} = useDIDAuth();

  const parsedSelectedCredentials = useMemo(() => {
    return Object.keys(selectedCredentials)
      .filter(credentialId => {
        return !!selectedCredentials[credentialId];
      })
      .map(credentialId => {
        return selectedCredentials[credentialId];
      });
  }, [selectedCredentials]);

  const isFormValid = useMemo(() => {
    if (step === SELECT_CREDENTIALS) {
      return parsedSelectedCredentials.length > 0;
    } else if (step === SELECT_DID) {
      return !!selectedDID;
    }
    return false;
  }, [parsedSelectedCredentials.length, selectedDID, step]);

  const onPresentCredentials = useCallback(async () => {
    const keyDoc = await getSelectedDIDKeyDoc({selectedDID});
    const {url, nonce} = getParamsFromUrl(deepLinkUrl);

    if (keyDoc) {
      const presentation = await presentCredentials({
        credentials: parsedSelectedCredentials,
        keyDoc,
        challenge: nonce,
        id: deepLinkUrl,
      });
      const parsedUrl = decodeURIComponent(url);

      const req = await fetch(parsedUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(presentation),
      });
      const response = await req.json();
      if (response.error) {
        throw new Error(response.error);
      } else {
        showToast({
          message: translate('credentials.credential_shared'),
          type: 'success',
        });
        navigate(Routes.ACCOUNTS);
        return;
      }
    }
    throw new Error(translate('credentials.no_key_doc'));
  }, [
    deepLinkUrl,
    getSelectedDIDKeyDoc,
    parsedSelectedCredentials,
    presentCredentials,
    selectedDID,
  ]);

  const onNext = useCallback(
    async dids => {
      if (
        step === SELECT_CREDENTIALS &&
        Array.isArray(dids) &&
        dids.length === 1
      ) {
        await onPresentCredentials();
      } else if (step === SELECT_CREDENTIALS) {
        setStep(SELECT_DID);
      } else if (step === SELECT_DID) {
        await onPresentCredentials();
      }
    },
    [onPresentCredentials, step],
  );
  return useMemo(() => {
    return {
      selectedCredentials,
      setSelectedCredentials,
      step,
      onNext: withErrorToast(onNext),
      onPresentCredentials: withErrorToast(onPresentCredentials),
      onSelectDID,
      isFormValid,
    };
  }, [isFormValid, onNext, onPresentCredentials, selectedCredentials, step]);
}
