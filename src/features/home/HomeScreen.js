import {
  Header,
  Footer,
  Content,
  Text,
  Container,
} from 'native-base';
import React from 'react';
import {useSelector} from 'react-redux';
import {walletsSelectors} from '../wallets/wallets-slice';

export function HomeScreen({navigation}) {
  const wallet = useSelector(walletsSelectors.getCurrentWallet);

  return (
    <Container>
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <H1>Welcome</H1>
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
