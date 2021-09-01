import React from 'react';
import SplashLogo from '../../assets/splash-logo.png';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {
  Box,
  Content,
  Footer,
  Header,
  Image,
  LoadingButton,
  ScreenContainer,
} from '../../design-system';
import {translate} from '../../locales';
import {BuildIdentifier} from '../app/BuildIdentifier';

export function CreateWalletScreen() {
  return (
    <ScreenContainer testID="createWalletScreen">
      <Header />
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
          {translate('create_wallet.create_new')}
        </LoadingButton>
        <LoadingButton
          full
          variant="ghost"
          mt={4}
          testID="createWalletButton"
          onPress={() => navigate(Routes.WALLET_IMPORT_BACKUP)}>
          {translate('create_wallet.import_existing')}
        </LoadingButton>
        <BuildIdentifier />
      </Footer>
    </ScreenContainer>
  );
}
