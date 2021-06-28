import {Button, Checkbox, FormControl, Stack} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../core/toast';
import {
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
  SelectToggler,
  Text,
  NBox as Box,
  Select,
  Input,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import { createAccountOperations, createAccountSelectors } from './create-account-slice';

export function CreateAccountVerifyPhraseScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  confirmationIndexes,
}) {
  return (
    <ScreenContainer testID="createAccountVerifyPhraseScreen">
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
          Verify recovery phrase
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          Verify that you wrote down the 12 words correctly
        </Typography>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>Verify word #{`${confirmationIndexes[0] + 1}`}</FormControl.Label>
            <Input value={form.word1} onChangeText={onChange('word1')} autoCapitalize='none' />
          </Stack>
        </FormControl>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>Verify word #{`${confirmationIndexes[1] + 1}`}</FormControl.Label>
            <Input value={form.word2} onChangeText={onChange('word2')} autoCapitalize='none' />
          </Stack>
        </FormControl>
      </Content>
      <Footer marginBottom={0} marginLeft={26} marginRight={26}>
        <Button full testID="next-btn" mb={5} onPress={onSubmit} disabled={submitDisabled}>
          Next
        </Button>
      </Footer>
    </ScreenContainer>
  );
}

export function CreateAccountVerifyPhraseContainer() {
  const dispatch = useDispatch();
  const phrase = useSelector(createAccountSelectors.getMnemonicPhrase);
  const [confirmationIndexes, setConfirmationIndexes] = useState([]);
  const [form, setForm] = useState({
    word1: '',
    word2: '',
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
    const words = phrase.split(' ');
    const word1 = form.word1.toLowerCase();
    const word2 = form.word2.toLowerCase();

    if (word1 === words[confirmationIndexes[0]] && word2 === words[confirmationIndexes[1]]) {
      dispatch(createAccountOperations.createAccount());
      return;
    }

    showToast({
      message: 'Invalid confirmation, please try again',
      type: 'error'
    })
  };
  
  useEffect(() => {
    setConfirmationIndexes([0, 2])
  }, [])

  const submitDisabled = !(form.word1 && form.word2);

  return (
    <CreateAccountVerifyPhraseScreen
      form={form}
      confirmationIndexes={confirmationIndexes}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}