import React from 'react';
import {StyleSheet} from 'react-native';
import SplashLogo from '../../assets/splash-logo.png';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {addTestId} from '../../core/automation-utils';
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

const styles = StyleSheet.create({
  logo: {
    width: '57%',
  },
});

export function CreateWalletScreen() {
  return (
    <ScreenContainer testID="createWalletScreen" hideGlobalHeader={true}>
      <Header />
      <Content>
        <Box flex={1} justifyContent="center" row marginTop="50%">
          <Image source={SplashLogo} style={styles.logo} resizeMode="contain" />
        </Box>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          {...addTestId('createWalletButton')}
          onPress={() => navigate(Routes.CREATE_WALLET_PASSCODE_SETUP)}>
          {translate('create_wallet.create_new')}
        </LoadingButton>
        <LoadingButton
          full
          variant="ghost"
          mt={4}
          {...addTestId('import_existing')}
          onPress={() => navigate(Routes.WALLET_IMPORT_BACKUP)}>
          {translate('create_wallet.import_existing')}
        </LoadingButton>
        <BuildIdentifier />
      </Footer>
    </ScreenContainer>
  );
}
