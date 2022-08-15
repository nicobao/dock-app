import {addTestId} from 'src/core/automation-utils';
import React, {useState} from 'react';
import {
  Box,
  Header,
  NBox,
  ScreenContainer,
  Typography,
  Input,
} from '../../design-system';
import {ScrollView} from 'react-native';
import {Button, Spinner, Stack, FormControl} from 'native-base';
import {translate} from '../../locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {validateEmail, getScopeFields, extractClientInfo} from './didAuthUtils';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {CustomSelectInput} from '../../components/CustomSelectInput';
import {useDIDAuth, useDIDAuthHandlers} from './didAuthHooks';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
// Taken from https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&ss=chromium

export function DIDAuthConfirmScreen({
  authenticateDID,
  profileData,
  selectedDID,
  clientInfo,
  dids = [],
  handleChange,
}) {
  const [error, setError] = useState();
  const {name, scope} = clientInfo;
  const fields = getScopeFields(scope);

  function handleCancel() {
    navigate(Routes.ACCOUNTS);
  }

  function handleSubmit() {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = profileData[field.id];
      if (field.required && !value) {
        setError(`${field.name} is required`);
        return;
      }

      if (value && field.type === 'email' && !validateEmail(value)) {
        setError(`${field.name} must be a valid email address`);
        return;
      }
    }

    setError(null);
    authenticateDID();
  }

  return (
    <ScreenContainer testID="DIDAuthConfirmScreen">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <Header marginTop={22}>
          <Box
            marginLeft={22}
            marginRight={22}
            flexDirection="row"
            alignItems="center">
            <Box flex={1}>
              <Typography variant="h1" textAlign="center">
                {translate('auth.authorize')} {name}
              </Typography>
            </Box>
          </Box>
        </Header>
        <Stack direction={'column'} mx={4}>
          <NBox mb={50}>
            <Typography textAlign="center" variant="list-description">
              {translate('auth.sign_in_msg')}
            </Typography>
          </NBox>

          <FormControl isInvalid={!!error}>
            <Stack mt={7}>
              <FormControl.Label>
                {translate('didManagement.did_name')}
              </FormControl.Label>
              <CustomSelectInput
                {...addTestId('DID')}
                onPressItem={item => {
                  handleChange('did', item.value);
                }}
                renderItem={item => {
                  return (
                    <>
                      <Typography
                        numberOfLines={1}
                        textAlign="left"
                        variant="description">
                        {item.label}
                      </Typography>
                      <Typography
                        numberOfLines={1}
                        textAlign="left"
                        variant="screen-description">
                        {item.description}
                      </Typography>
                    </>
                  );
                }}
                items={dids}
              />
            </Stack>
          </FormControl>

          <FormControl isInvalid={!!error}>
            <Box marginTop={12}>
              {fields.map(field => (
                <>
                  <Typography variant="field-label">{field.name}:</Typography>
                  <Box marginTop={4} marginBottom={12}>
                    <Input
                      placeholder={field.placeholder}
                      {...addTestId(field.name)}
                      value={profileData[field.id]}
                      onChangeText={value => {
                        handleChange(field.id, value);
                      }}
                      autoCapitalize="none"
                      secureTextEntry={field.type === 'password'}
                    />
                  </Box>
                </>
              ))}
            </Box>
            <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
          </FormControl>
        </Stack>

        <Stack direction={'row'} mt={'auto'} mx={4} mb={10}>
          <Button.Group
            mx={{
              base: 'auto',
              md: 0,
            }}
            size="md">
            <Button onPress={handleCancel} width="48.5%" colorScheme="dark">
              <Typography>{translate('navigation.cancel')}</Typography>
            </Button>
            <Button
              onPress={handleSubmit}
              disabled={!selectedDID}
              width="48.5%">
              <Typography>{translate('navigation.approve')}</Typography>
            </Button>
          </Button.Group>
        </Stack>
      </ScrollView>
    </ScreenContainer>
  );
}

export function DIDAuthScreen({authState, retry}) {
  return (
    <ScreenContainer testID="DIDAuthScreen">
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('qr_scanner.header')}
            </Typography>
          </Box>
        </Box>
      </Header>
      <Stack direction={'column'} mx={70} mt={40}>
        <NBox mt={15}>
          {authState === 'processing' ? (
            <Spinner />
          ) : (
            <Typography
              style={{
                textAlign: 'center',
              }}
              variant="list-description">
              {translate(`qr_scanner.${authState}`)}
            </Typography>
          )}
        </NBox>
        {authState === 'error' ? (
          <Button onPress={retry} mt={7}>
            <Typography>{translate('qr_scanner.retry')}</Typography>
          </Button>
        ) : null}
      </Stack>
    </ScreenContainer>
  );
}

export function DIDAuthScreenContainer({route}) {
  const {dockWalletAuthDeepLink} = route.params || {};

  const {dids, authState, handleRetry, authenticateDID} = useDIDAuth();
  const {profileData, selectedDID, handleChange} = useDIDAuthHandlers();
  const clientInfo = extractClientInfo(dockWalletAuthDeepLink);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior="padding"
      style={{flex: 1}}>
      {authState === 'start' ? (
        <DIDAuthConfirmScreen
          {...{
            authenticateDID: () => {
              authenticateDID({
                dockWalletAuthDeepLink,
                selectedDID,
                profileData,
              });
            },
            profileData,
            dids,
            selectedDID,
            clientInfo,
            handleChange,
          }}
        />
      ) : (
        <DIDAuthScreen authState={authState} retry={handleRetry} />
      )}
    </KeyboardAvoidingView>
  );
}
