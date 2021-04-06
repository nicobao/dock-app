import {
  H1,
  Picker,
  Header,
  Footer,
  Content,
  Button,
  Text,
  Container,
  Spinner,
  View,
  Form,
  Item,
  Label,
  Input,
  Grid,
  Row,
  Col,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {InteractionManager} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Colors} from '../../theme/colors';
import {walletsOperations, walletsSelectors} from './wallets-slice';

const Title = styled(H1)``;

export function UnlockWalletScreen({navigation}) {
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState();
  const wallets = useSelector(walletsSelectors.getItems);
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const handlePasswordChange = value => setPassword(value);

  const handleCreateWallet = () => {
    navigate(Routes.CREATE_WALLET);
  };
  const handleUnlockWallet = async () => {
    setError(null);
    setLoading(true);

    InteractionManager.runAfterInteractions(() => {
      dispatch(
        walletsOperations.unlockWallet({address: selectedAddress, password}),
      ).catch(() => {
        setLoading(false);
        setError('Invalid password, please try again.');
      });
    });
  };

  useEffect(() => {
    if (!wallets) {
      return;
    }

    if (!wallets.length) {
      navigate(Routes.CREATE_WALLET);

      return;
    }

    if (!selectedAddress) {
      setSelectedAddress(wallets[0].address);
    }
  }, [wallets]);

  if (!wallets || !wallets.length) {
    return (
      <Container>
        <Content>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <Spinner color={Colors.darkBlue} />
            <Text>Loading...</Text>
          </View>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <Title>Select a Wallet</Title>
      </Header>
      <Content>
        <Form>
          <Item picker>
            <Picker
              note
              mode="dropdown"
              style={{width: 200}}
              placeholder="Select a wallet"
              selectedValue={selectedAddress}
              onValueChange={v => setSelectedAddress(v)}>
              {wallets.map(wallet => (
                <Picker.Item
                  label={wallet.meta.name}
                  value={wallet.address}
                  key={wallet.address}
                />
              ))}
            </Picker>
          </Item>
          {selectedAddress ? (
            <Item floatingLabel>
              <Label>Enter the password</Label>
              <Input
                onChangeText={handlePasswordChange}
                value={password}
                secureTextEntry={true}
                error={error}
              />
            </Item>
          ) : null}
        </Form>
        <View style={{padding: 20}}>
          {<Text style={{color: Colors.red}}>{error}</Text>}
        </View>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8, height: 120}}>
        <Grid>
          <Row>
            <Col>
              <Button
                full
                style={{width: '100%'}}
                primary
                onPress={handleUnlockWallet}
                disabled={!selectedAddress || loading}>
                {loading ? (
                  <Spinner color="#fff" size={15} />
                ) : (
                  <Text style={{color: '#fff'}}>Unlock Wallet</Text>
                )}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                full
                style={{width: '100%'}}
                bordered
                onPress={handleCreateWallet}>
                <Text style={{color: Colors.darkBlue}}>Create new wallet</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Footer>
    </Container>
  );
}
