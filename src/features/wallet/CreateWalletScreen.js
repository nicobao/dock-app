import React, { useState } from 'react';
import {
  Image,
  Button,
  LoadingButton,
  Header,
  Footer,
  Content,
  ScreenContainer,
  Box,
  Theme,
} from '../../design-system';
import styled, {ThemeProvider} from 'styled-components/native';

import SplashLogo from '../../assets/splash-logo.png';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import { WalletConstants } from './constants';

export function CreateWalletScreen() {
  return (
    <ScreenContainer testID="createWalletScreen">
      <Header></Header>
      <Content>
        <Box flex={1} justifyContent="center" row marginTop="50%">
          <Image
            source={SplashLogo}
            style={{
              width: '57%',
            }}
            resizeMode="contain"
          />
        </Box>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID="createWalletButton"
          onPress={() => navigate(Routes.CREATE_WALLET_PASSCODE)}>
          {WalletConstants.createWallet.locales.createNewWallet}
        </LoadingButton>
        <LoadingButton
          full
          variant="link"
          mt={4}
          testID="createWalletButton"
          onPress={() => navigate(Routes.WALLET_IMPORT_BACKUP)}>
          {WalletConstants.createWallet.locales.importWallet}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}
