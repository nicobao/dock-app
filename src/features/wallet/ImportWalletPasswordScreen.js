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
import { walletOperations } from './wallet-slice';

export function ImportWalletPasswordScreen({
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
          Enter password
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

export function ImportWalletPasswordContainer({ route }) {
  const dispatch = useDispatch();
  const { fileUri } = route.params;
  const [form, setForm] = useState({
    password: '',
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
    return dispatch(walletOperations.importWallet({
      password: form.password,
      fileUri,
    }));
  };

  const submitDisabled = !form.password;

  return (
    <ImportWalletPasswordScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
