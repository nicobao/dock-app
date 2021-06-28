import {
  Button,
  FormControl,
  Stack,
  Tooltip,
  Pressable,
  Popover,
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {navigate} from '../../core/navigation';
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
  InputPopover,
  LoadingButton,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {
  createAccountActions,
  createAccountOperations,
} from './create-account-slice';

export function CreateAccountSetupScreen({
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
          Account Name
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          This will be used just for easy reference
        </Typography>
        <Box mt={7}>
          <Input
            placeholder="Account name"
            value={form.accountName}
            onChangeText={onChange('accountName')}
          />
        </Box>

        <SelectToggler placeholder="Advanced options">
          <FormControl>
            <Stack mt={7}>
              <FormControl.Label>
                Keypair crypto type
                <InputPopover>
                  Determines what cryptography will be used to create this
                  account. Note that to validate on Polkadot, the session
                  account must use "ed25519".
                </InputPopover>
              </FormControl.Label>
              <Select
                onValueChange={onChange('keypairType')}
                selectedValue={form.keypairType}>
                <Select.Item
                  label="Schnorrkel (sr25519, recommended)"
                  value="sr25519"
                />
                <Select.Item
                  label="Edwards (ed25519, alternative)"
                  value="ed25519"
                />
                <Select.Item
                  label="ECDSA (Non BTC/ETH compatible)"
                  value="ecdsa"
                />
              </Select>
            </Stack>
          </FormControl>
          <FormControl isInvalid={false}>
            <Stack mt={7}>
              <FormControl.Label>
                Secret derivation path
                <InputPopover>
                  {`You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed. An optional "///<password>" can be used with a mnemonic seed, and may only be specified once.`}
                </InputPopover>
              </FormControl.Label>
              <Input
                placeholder="//hard/soft//password"
                onChangeText={onChange('derivationPath')}
                autoCapitalize="none"
              />
              <FormControl.ErrorMessage>
                Unable to match provided value to a secret URI.
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
        </SelectToggler>
      </Content>
      <Footer marginBottom={114} marginLeft={26} marginRight={26}>
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

export function CreateAccountSetupContainer() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    accountName: '',
    keypairType: 'sr25519',
    derivationPath: '',
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
    return dispatch(createAccountOperations.submitAccountForm(form));
  };

  const submitDisabled = !form.accountName;

  return (
    <CreateAccountSetupScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
