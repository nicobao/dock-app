import {Button, Checkbox, FormControl, Stack} from 'native-base';
import Clipboard from '@react-native-community/clipboard';

import React from 'react';
import { useSelector } from 'react-redux';
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
import { createAccountSelectors } from './create-account-slice';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';
import { showToast } from '../../core/toast';

export function CreateAccountMnemonicScreen({
  phrase,
  onCopy,
  onSubmit
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
          Account recovery phrase
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          Write this down or copy these words in the right order and save them
          somewhere safe. Do not share it to anyone
        </Typography>
        <Box
          flexDirection="row"
          flexWrap="wrap"
          backgroundColor="#27272A"
          borderRadius={12}
          p={5}
          mt={8}>
          {phrase.split(' ').map((word, idx) => (
            <Box flexDirection="row" width="33%" p={3}>
              <Text fontSize={14} mr={2} color="#A1A1AA">{`${idx + 1}`}</Text>
              <Text fontSize={14}>{word}</Text>
            </Box>
          ))}
        </Box>

        <Button
          full
          testID="next-btn"
          variant="unstyled"
          backgroundColor="#27272A"
          _text={
            {
              // fontSize: 16
            }
          }
          mt={5}
          onPress={onCopy}>
          Copy to clipboard
        </Button>
      </Content>
      <Footer marginBottom={0} marginLeft={26} marginRight={26}>
        <Button full testID="next-btn" mb={5} onPress={onSubmit}>
          Next
        </Button>
      </Footer>
    </ScreenContainer>
  );
}

export function CreateAccountMnemonicContainer() {
  const phrase = useSelector(createAccountSelectors.getMnemonicPhrase);
  
  const handleCopy = () => {
    Clipboard.setString(phrase);

    showToast({
      message: 'Recovery phrase copied!'
    });
  };

  const handleSubmit = () => {
    navigate(Routes.CREATE_ACCOUNT_VERIFY_PHRASE);
  }

  return (
    <CreateAccountMnemonicScreen
      phrase={phrase}
      onSubmit={handleSubmit}
      onCopy={handleCopy}
    />
  )
}