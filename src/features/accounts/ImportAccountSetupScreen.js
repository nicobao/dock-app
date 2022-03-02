import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addTestId} from 'src/core/automation-utils';
import {
  Content,
  Footer,
  Header,
  Input,
  LoadingButton,
  NBox as Box,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {translate} from '../../locales';
import {
  createAccountOperations,
  createAccountSelectors,
} from '../account-creation/create-account-slice';

export function ImportAccountSetupScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
}) {
  return (
    <ScreenContainer {...addTestId('ImportAccountSetupScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('import_account.title')}
        </Typography>
        <Box mt={7}>
          <Input
            placeholder={translate('import_account.account_name_input')}
            value={form.accountName}
            onChangeText={onChange('accountName')}
            autoCapitalize="none"
            {...addTestId('ImportAccountNameInput')}
          />
        </Box>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          {...addTestId('NextBtn')}
          full
          isDisabled={submitDisabled}
          onPress={onSubmit}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function ImportAccountSetupContainer() {
  const dispatch = useDispatch();
  const currentForm = useSelector(createAccountSelectors.getForm);
  const [form, setForm] = useState({
    ...currentForm,
    accountName: currentForm.accountName || '',
    _errors: {},
    _hasError: false,
  });

  const handleChange = key => evt => {
    setForm(v => ({
      ...v,
      [key]: evt,
    }));
  };

  const handleSubmit = () => {
    return dispatch(
      createAccountOperations.createAccount({
        hasBackup: true,
        successMessage: translate('import_account.import_success'),
        form,
      }),
    );
  };

  const submitDisabled = !form.accountName;

  return (
    <ImportAccountSetupScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
