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
import LockClosedIcon from '../../assets/icons/lock-closed.svg';
import {translate} from 'src/locales';

export function SetupPasscodeScreen() {
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
          {translate('setup_passcode.title')}
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          {translate('setup_passcode.description')}
        </Typography>
      </Content>
      <Footer marginBottom={114} marginLeft={26} marginRight={26}>
        <Button full icon={<LockClosedIcon />} testID="create-wallet-btn">
          {translate('setup_passcoe.submit')}
        </Button>
      </Footer>
    </ScreenContainer>
  );
}
