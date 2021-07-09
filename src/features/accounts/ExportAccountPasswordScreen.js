import {
  Button,
  FormControl,
  Stack,
  Tooltip,
  Pressable,
  Popover,
  TextArea,
  CheckCircleIcon,
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '../../core/toast';
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
  createAccountOperations,
  createAccountSelectors,
} from '../account-creation/create-account-slice';
import {accountOperations} from './account-slice';

export function ExportAccountPasswordScreen({
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
          Create a password
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          This will be used when you import your account to a new device.
        </Typography>

        <Box mt={7}>
          <Input
            placeholder="Password"
            value={form.password}
            onChangeText={onChange('password')}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </Box>

        <Box mt={7}>
          <Input
            placeholder="Confirm password"
            value={form.passwordConfirmation}
            onChangeText={onChange('passwordConfirmation')}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </Box>
        <Stack marginTop={4}>
          <Stack direction="row">
            <CheckCircleIcon
              color={form.lengthValidation ? '#34D399' : '#71717A'}
              width={16}
              height={16}
              marginRight={2}
            />
            <Typography>Must include 8-12 characters</Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircleIcon
              color={form.digitsValidation ? '#34D399' : '#71717A'}
              width={16}
              height={16}
              marginRight={2}
            />
            <Typography>Must include digits</Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircleIcon
              color={form.caseValidation ? '#34D399' : '#71717A'}
              width={16}
              height={16}
              marginRight={2}
            />
            <Typography>
              Must include uppercase and lowercase letters
            </Typography>
          </Stack>
        </Stack>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID="next-btn"
          isDisabled={submitDisabled}
          onPress={onSubmit}>
          Next
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function ExportAccountPasswordContainer({route}) {
  const dispatch = useDispatch();
  const {method, accountId} = route.params;
  const [form, setForm] = useState({
    password: '',
    passwordConfirmation: '',
    _errors: {},
    _hasError: false,
  });

  const handleChange = key => value => {
    const updatedForm = {
      [key]: value,
    };

    if (key === 'password') {
      updatedForm.lengthValidation = value.length >= 8 && value.length <= 12;
      updatedForm.digitsValidation = /\d/.test(value);
      updatedForm.caseValidation = /[A-Z]/.test(value) && /[a-z]/.test(value);
    }

    setForm(v => ({
      ...v,
      ...updatedForm,
    }));
  };

  const handleSubmit = () => {
    if (form.password !== form.passwordConfirmation) {
      showToast({
        message: "Password confirmation doesn't match",
        type: 'error',
      });
      return;
    }
    return dispatch(
      accountOperations.exportAccountAs({
        accountId,
        method,
        password: form.password,
      }),
    );
  };

  const formValid =
    form.password &&
    form.passwordConfirmation &&
    form.caseValidation &&
    form.digitsValidation &&
    form.lengthValidation;

  return (
    <ExportAccountPasswordScreen
      form={form}
      submitDisabled={!formValid}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
