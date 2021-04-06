import {
  Form,
  H1,
  Input,
  Item,
  Label,
  Header,
  Footer,
  Content,
  Button,
  Text,
  Container,
  View,
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Colors} from '../../theme/colors';
import {walletsOperations} from './walletsSlice';

const Title = styled(H1)``;

export function CreateWalletScreen({navigation}) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    walletName: null,
    password: null,
    confirmPassword: null,
  });
  const [error, setError] = useState();

  const handleFormChange = key => value =>
    setForm({
      ...form,
      [key]: value,
    });

  const handleCreateWallet = () => {
    if (!form.password || !form.walletName) {
      setError('Please enter the required fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password confirmation doesn't match");
      return;
    }

    dispatch(
      walletsOperations.createWallet({
        password: form.password,
        walletName: form.password,
      }),
    );
  };

  return (
    <Container>
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <Title>Create Wallet</Title>
      </Header>
      <Content>
        <Form>
          <Item floatingLabel>
            <Label>Wallet name</Label>
            <Input
              onChangeText={handleFormChange('walletName')}
              value={form.walletName}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              onChangeText={handleFormChange('password')}
              value={form.password}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Confirm Password</Label>
            <Input
              secureTextEntry={true}
              onChangeText={handleFormChange('confirmPassword')}
              value={form.confirmPassword}
            />
          </Item>
        </Form>
        <View style={{padding: 20}}>
          {<Text style={{color: Colors.red}}>{error}</Text>}
        </View>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button
          full
          style={{width: '100%'}}
          primary
          onPress={handleCreateWallet}>
          <Text style={{color: '#fff'}}>Create Wallet</Text>
        </Button>
      </Footer>
    </Container>
  );
}
