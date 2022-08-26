import React from 'react';
import {addTestId} from '../../core/automation-utils';
import {
  BackButton,
  Header,
  LoadingButton,
  NBox,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {ScrollView} from 'native-base';
import {useCredentials} from './credentials';
import {
  SELECT_CREDENTIALS,
  useCredentialPresentation,
} from './hooks/credentialPresentation';
import {SelectCredentialsComponent} from './components/SelectCredentialsComponent';
import {SelectDIDComponent} from './components/SelectDIDComponent';
import {useDIDAuth} from '../didManagement/didAuthHooks';
export function ShareCredentialScreen({
  onPresentCredentials,
  credentials,
  selectedCredentials,
  setSelectedCredentials,
  onNext,
  step,
  dids,
  onSelectDID,
  isFormValid,
}) {
  return (
    <ScreenContainer {...addTestId('ShareCredentialScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <ScrollView mt={7} marginLeft={3} marginRight={3}>
        {step === SELECT_CREDENTIALS ? (
          <SelectCredentialsComponent
            selectedCredentials={selectedCredentials}
            credentials={credentials}
            setSelectedCredentials={setSelectedCredentials}
          />
        ) : (
          <SelectDIDComponent dids={dids} handleChange={onSelectDID} />
        )}
      </ScrollView>
      <NBox mb={7} mx={7}>
        <LoadingButton
          isDisabled={!isFormValid}
          {...addTestId('PresentCredentialBtn')}
          full
          onPress={async () => {
            if (step === SELECT_CREDENTIALS) {
              onNext();
            } else {
              await onPresentCredentials();
            }
          }}
          size="sm">
          <Typography variant="credentialShareTitle" mb={2}>
            {translate('navigation.next')}
          </Typography>
        </LoadingButton>
      </NBox>
    </ScreenContainer>
  );
}

export function ShareCredentialScreenContainer({route}) {
  const {deepLinkUrl} = route.params || {};

  const {credentials} = useCredentials({onPickFile: () => {}});
  const {
    selectedCredentials,
    setSelectedCredentials,
    onPresentCredentials,
    onNext,
    step,
    onSelectDID,
    isFormValid,
  } = useCredentialPresentation(deepLinkUrl);
  const {dids} = useDIDAuth();

  return (
    <ShareCredentialScreen
      selectedCredentials={selectedCredentials}
      setSelectedCredentials={setSelectedCredentials}
      credentials={credentials}
      onPresentCredentials={onPresentCredentials}
      onNext={onNext}
      step={step}
      dids={dids}
      onSelectDID={onSelectDID}
      isFormValid={isFormValid}
    />
  );
}
