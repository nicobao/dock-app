import React, {useState} from 'react';
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
import {translate} from '../../locales';

export function ImportWalletScreen({onSubmit, onImportFromClipboard}) {
  const [pressCount, setPressCount] = useState(0);

  return (
    <ScreenContainer testID="create-wallet-screen">
      <Header>
        <BackButton
          testID="BackButton.importWallet"
          accessibilityLabel="BackButton.importWallet"
        />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography
          variant="h1"
          marginTop={52}
          onPress={() => {
            if (pressCount >= 10 && onImportFromClipboard) {
              return onImportFromClipboard();
            }

            setPressCount(p => p + 1);
          }}>
          {translate('import_wallet.title')}
        </Typography>
        <Typography marginTop={12}>
          {translate('import_wallet.description')}
        </Typography>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <Button
          onPress={onSubmit}
          full
          testID="importWallet.submitBtn"
          accessibilityLabel="importWallet.submitBtn">
          {translate('import_wallet.submit')}
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

  const handleImportFromClipboard = () => {
    dispatch(walletOperations.importFromClipboard());
  };

  return (
    <ImportWalletScreen
      onSubmit={handleSubmit}
      onImportFromClipboard={handleImportFromClipboard}
    />
  );
}
