import React from 'react';
import {
  Button,
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {useDispatch} from 'react-redux';
import {walletOperations} from './wallet-slice';
import {WalletConstants} from './constants';

export function ImportWalletScreen({onSubmit}) {
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
          {WalletConstants.importWallet.locales.title}
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          {WalletConstants.importWallet.locales.description}
        </Typography>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <Button
          onPress={onSubmit}
          full
          testID={WalletConstants.importWallet.testID.submitBtn}>
          {WalletConstants.importWallet.locales.submitBtn}
        </Button>
      </Footer>
    </ScreenContainer>
  );
}

export function ImportWalletContainer() {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(walletOperations.pickWalletBackup());
  };

  return <ImportWalletScreen onSubmit={handleSubmit} />;
}
