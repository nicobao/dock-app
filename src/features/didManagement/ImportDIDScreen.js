import {
  BackButton,
  Box,
  Header,
  Input,
  LoadingButton,
  NBox,
  ScreenContainer,
} from '../../design-system';
import {addTestId} from '../../core/automation-utils';
import {navigateBack} from '../../core/navigation';
import {translate} from '../../locales';
import {FormControl, ScrollView, Stack} from 'native-base';
import React, {useCallback} from 'react';
import {useDIDManagementHandlers} from './didHooks';

export function ImportDIDScreen({
  form,
  handleChange,
  handleSubmit,
  encryptedJSONWallet,
}) {
  return (
    <ScreenContainer {...addTestId('ImportDIDScreen')}>
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton {...addTestId('GoBack')} onPress={navigateBack} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}
          />
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <ScrollView marginLeft={5} marginRight={5}>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('password_input.title')}
            </FormControl.Label>
            <Input
              {...addTestId('Password')}
              value={form.password}
              onChangeText={handleChange('password')}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          </Stack>
        </FormControl>
      </ScrollView>
      <NBox mx={7}>
        <LoadingButton
          {...addTestId('Next')}
          full
          testID="next-btn"
          mb={70}
          onPress={handleSubmit}
          isDisabled={form.password.trim().length <= 0 && encryptedJSONWallet}>
          {translate('password_input.submit')}
        </LoadingButton>
      </NBox>
    </ScreenContainer>
  );
}

export function ImportDIDScreenContainer({route}) {
  const {encryptedJSONWallet} = route.params || {};
  const {form, handleChange, onImportDID} = useDIDManagementHandlers();

  const handleSubmit = useCallback(async () => {
    await onImportDID({encryptedJSONWallet, password: form.password});
  }, [encryptedJSONWallet, form.password, onImportDID]);
  return (
    <ImportDIDScreen
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      encryptedJSONWallet={encryptedJSONWallet}
    />
  );
}
