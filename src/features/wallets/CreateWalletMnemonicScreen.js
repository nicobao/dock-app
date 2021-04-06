import {
  H1,
  Header,
  Footer,
  Content,
  Button,
  Text,
  Container,
} from 'native-base';
import React from 'react';
import styled from 'styled-components/native';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';

const Title = styled(H1)``;

export function CreateWalletMnemonicScreen({navigation, route}) {
  const mnemonic = route.params.mnemonic;
  const handleComplete = () => {
    navigate(Routes.APP_HOME);
  };

  return (
    <Container>
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <Title>Backup your Wallet</Title>
      </Header>
      <Content>
        <Text>Copy your mnemonic phrase:</Text>
        <Text>{mnemonic}</Text>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleComplete}>
          <Text style={{color: '#fff'}}>Complete</Text>
        </Button>
      </Footer>
    </Container>
  );
}
