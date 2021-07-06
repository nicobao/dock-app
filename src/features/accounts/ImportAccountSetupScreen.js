import {
  Button,
  FormControl,
  Stack,
  Tooltip,
  Pressable,
  Popover,
  TextArea,
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
  SelectToggler,
  NBox as Box,
  Select,
  Input,
  InputPopover,
  LoadingButton,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {
  createAccountOperations, createAccountSelectors,
} from '../account-creation/create-account-slice';

export function ImportAccountSetupScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
}) {
  return (
    <ScreenContainer testID="create-wallet-screen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography
          fontFamily="Montserrat"
          fontSize={24}
          lineHeight={32}
          fontWeight="600"
          color="#fff"
          marginTop={52}>
          Account name
        </Typography>
        <Box mt={7}>
          <Input
            placeholder="Account name"
            value={form.accountName}
            onChangeText={onChange('accountName')}
            autoCapitalize="none"
          />
        </Box>

      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID="next-btn"
          disabled={submitDisabled}
          onPress={onSubmit}>
          Next
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function ImportAccountSetupContainer() {
  const dispatch = useDispatch();
  const currentForm = useSelector(createAccountSelectors.getForm)
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
    return dispatch(createAccountOperations.createAccount({
      hasBackup: true,
      successMessage: 'Account successfully imported',
      form,
    }));
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
