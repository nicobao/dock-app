import {
  H1,
  Header,
  Footer,
  Content,
  Text,
  Container,
} from 'native-base';
import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {walletsSelectors} from '../wallets/wallets-slice';

const Title = styled(H1)``;

export function HomeScreen({navigation}) {
  const wallet = useSelector(walletsSelectors.getCurrentWallet);

  return (
    <Container>
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <Title>Welcome</Title>
      </Header>
      <Content>
        <Text>{wallet.address}</Text>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        {
          // navigation menu
        }
      </Footer>
    </Container>
  );
}
