import React from 'react';
import {
  Image,
  Button,
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

export function CreateWalletScreen() {
  return (
    <ScreenContainer testID="create-wallet-screen">
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
      <Footer marginBottom={114} marginLeft={26} marginRight={26}>
        <Button
          full
          testID="create-wallet-btn"
          onPress={() => navigate(Routes.CREATE_WALLET_PASSCODE)}>
          Create a new wallet
        </Button>
      </Footer>
    </ScreenContainer>
  );
}
