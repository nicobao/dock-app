import React, {useCallback} from 'react';
import {addTestId} from '../../core/automation-utils';
import {
  BackButton,
  Content,
  Footer,
  Header,
  Input,
  LoadingButton,
  NBox as Box,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {FormControl, Stack} from 'native-base';
import {translate} from '../../locales';
import {CheckCircle} from '../../components/CheckCircleComponent';
import {useDIDManagementHandlers, useExportDIDHandlers} from './didHooks';

export function ExportDIDScreen({form, onChange, formValid, onSubmit}) {
  return (
    <ScreenContainer {...addTestId('ExportDIDScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('didManagement.create_password')}
        </Typography>
        <Typography marginTop={3}>
          {translate('didManagement.create_password_desc')}
        </Typography>

        <Box>
          <FormControl>
            <Stack mt={7}>
              <FormControl.Label>
                {translate('didManagement.enter_password')}
              </FormControl.Label>
              <Input
                placeholder={translate('password_input.password')}
                {...addTestId('Password')}
                value={form.password}
                onChangeText={onChange('password')}
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </Stack>
          </FormControl>
        </Box>

        <Box mb={7}>
          <FormControl>
            <Stack mt={7}>
              <FormControl.Label>
                {translate('didManagement.confirm_password')}
              </FormControl.Label>
              <Input
                placeholder={translate('password_input.confirm_password')}
                {...addTestId('ConfirmPassword')}
                value={form.passwordConfirmation}
                onChangeText={onChange('passwordConfirmation')}
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </Stack>
          </FormControl>
        </Box>
        <Stack marginTop={4}>
          <Stack direction="row">
            <CheckCircle checked={form.lengthValidation} />
            <Typography>
              {translate('create_password.include_char_length')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.digitsValidation} />
            <Typography>
              {translate('create_password.include_digits')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.caseValidation} />
            <Typography>
              {translate('create_password.include_proper_case')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.specialCharactersValidation} />
            <Typography>
              {translate('create_password.include_special_characters')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.passwordMatchValidation} />
            <Typography>
              {translate('create_password.passwords_match')}
            </Typography>
          </Stack>
        </Stack>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          {...addTestId('NextBtn')}
          isDisabled={!formValid}
          onPress={onSubmit}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}
export function ExportDIDScreenContainer({route}) {
  const {didDocumentResolution} = route.params;

  const {form, handleChange, formValid} = useExportDIDHandlers();

  const {onExportDID} = useDIDManagementHandlers();

  const onSubmit = useCallback(async () => {
    await onExportDID({id: didDocumentResolution.id, password: form.password});
  }, [didDocumentResolution.id, form.password, onExportDID]);
  return (
    <ExportDIDScreen
      form={form}
      onChange={handleChange}
      formValid={formValid}
      onSubmit={onSubmit}
    />
  );
}
