import {
  Footer,
  Content,
  Button,
  Text,
  Container,
  H1,
  View,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Row,
  Grid,
  Col,
  Toast,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {didOperations, didSelectors} from './did-slice';
import styled from 'styled-components/native';
import {Modal} from '../../components/Modal';
import {Colors} from '../../theme/colors';
import {WalletPicker} from '../wallets/UnlockWalletScreen';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';
import { walletsOperations, walletsSelectors } from '../wallets/wallets-slice';
import { RefreshControl } from 'react-native';
import ExitApp from 'react-native-exit-app';
import Clipboard from '@react-native-community/clipboard';


const Divier = styled(View)`
  margin: 20px 0;
  border: 0 solid #ccc;
  border-bottom-width: 1px;
`;

export function SettingsScreen({navigation}) {
  const dispatch = useDispatch();
  const wallet = useSelector(walletsSelectors.getCurrentWallet);
  

  const handleBackup = () => {
    dispatch(walletsOperations.exportJSON());
    Toast.show({
      text: 'JSON copied to clipboard!',
      buttonText: 'Ok',
      duration: 3000,
    });
  };

  return (
    <Container style={{ backgroundColor: Colors.darkBlue }}>
      {/* <Header style={{alignItems: 'center', marginTop: 10}}>
        <H1>DIDs</H1>
      </Header> */}
      <Content >
        <List>
          <ListItem onPress={() => navigate(Routes.UNLOCK_WALLET)}>
            <Left>
              <Icon name="repeat-outline" style={{ color: 'white', marginRight: 12 }} />
              <Text style={{ color: 'white' }}>Switch Wallet</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => navigate(Routes.CREATE_WALLET)}>
            <Left>
              <Icon name="add-outline" style={{ color: 'white', marginRight: 12 }} />
              <Text style={{ color: 'white' }}>Create new Wallet</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={handleBackup}>
            <Left>
              <Icon name="save-outline" style={{ color: 'white', marginRight: 12 }} />
              <Text style={{ color: 'white' }}>Export JSON</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => dispatch(walletsOperations.deleteWallet())}>
            <Left>
              <Icon name="trash-outline" style={{ color: 'white', marginRight: 12 }} />
              <Text style={{ color: 'white' }}>Delete Wallet</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => ExitApp.exitApp()}>
            <Left>
              <Icon name="close-circle-outline" style={{ color: 'white', marginRight: 12 }} />
              <Text style={{ color: 'white' }}>Close App</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
}
