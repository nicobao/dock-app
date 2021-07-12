import {Button, Checkbox, FormControl, Stack} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { navigate } from '../../core/navigation';
import {Routes} from '../../core/routes';
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
  LoadingButton,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {createAccountOperations} from './create-account-slice';
import { CreateAccountBackupTestIDs } from './test-ids';

export function CreateAccountBackupScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  onSkip,
}) {
  return (
    <ScreenContainer testID={CreateAccountBackupTestIDs.screen}>
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
          Back up your account
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          In the next step you will see an account recovery phrase. This phrase
          is the only way you can recover access to your account if your phone
          is lost or stolen.
        </Typography>
      </Content>
      <Footer marginBottom={0} marginLeft={26} marginRight={26}>
        <Box alignItems="flex-start" mb={5}>
          <Checkbox isChecked={form.agreement} onChange={onChange('agreement')} accessibilityLabel="Backup agreement">
            I understand that if I lose my recovery phrase, I will not be able
            to access my account
          </Checkbox>
        </Box>
        <LoadingButton full testID={CreateAccountBackupTestIDs.nextBtn} mb={5} onPress={onSubmit} isDisabled={submitDisabled}>
          Next
        </LoadingButton>
        <LoadingButton full testID={CreateAccountBackupTestIDs.skipBtn} variant="unstyled" onPress={onSkip}>
          Skip
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function CreateAccountBackupContainer() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    agreement: false,
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
    navigate(Routes.CREATE_ACCOUNT_MNEMONIC);
  };

  const handleSkip = () => {
    return dispatch(createAccountOperations.createAccount());
  };

  const submitDisabled = !form.agreement;

  console.log(form);

  return (
    <CreateAccountBackupScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onSkip={handleSkip}
    />
  );
}
