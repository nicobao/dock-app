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
import {translate} from 'src/locales';
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
import {AccountsConstants} from './constants';

export function GenericPasswordScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  title,
  description,
}) {
  return (
    <ScreenContainer testID="create-wallet-screen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {title}
        </Typography>
        <Typography marginTop={12}>{description}</Typography>

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
            <Typography>
              {translate('create_password.include_char_length')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircleIcon
              color={form.digitsValidation ? '#34D399' : '#71717A'}
              width={16}
              height={16}
              marginRight={2}
            />
            <Typography>
              {translate('create_password.include_digits')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircleIcon
              color={form.caseValidation ? '#34D399' : '#71717A'}
              width={16}
              height={16}
              marginRight={2}
            />
            <Typography>
              {translate('create_password.include_proper_case')}
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
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function GenericPasswordContainer({onSubmit, title, description}) {
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

    return onSubmit(form);
  };

  const formValid =
    form.password &&
    form.passwordConfirmation &&
    form.caseValidation &&
    form.digitsValidation &&
    form.lengthValidation;

  return (
    <GenericPasswordScreen
      form={form}
      submitDisabled={!formValid}
      onChange={handleChange}
      onSubmit={handleSubmit}
      description={description}
      title={title}
    />
  );
}

export function ExportAccountPasswordContainer({route}) {
  const dispatch = useDispatch();
  const {method, accountId} = route.params;

  return (
    <GenericPasswordContainer
      description={AccountsConstants.exportAccount.locales.description}
      title={AccountsConstants.exportAccount.locales.title}
      onSubmit={form => {
        return dispatch(
          accountOperations.exportAccountAs({
            accountId,
            method,
            password: form.password,
          }),
        );
      }}
    />
  );
}
