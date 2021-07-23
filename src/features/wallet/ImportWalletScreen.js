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
import {translate} from '../../locales';

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
          {
            translate('import_wallet.title')
          }
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          {
            translate('import_wallet.description')
          }
        </Typography>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <Button
          onPress={onSubmit}
          full
          testID={WalletConstants.importWallet.testID.submitBtn}>
          {
            translate('import_wallet.submit')
          }
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
