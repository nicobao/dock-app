import React, {useContext, useEffect, useState} from 'react';
import {
  useWallet,
  WalletSDKContext,
} from '@docknetwork/wallet-sdk-react-native/lib';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import testCredential from '@docknetwork/wallet-sdk-credentials/fixtures/test-credential.json';
import {
  Button,
  CheckIcon,
  Divider,
  Flex,
  ScrollView,
  Select,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import {Theme} from '../design-system';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';

function CoreTest() {
  const {wallet, status, documents} = useWallet({syncDocs: true});
  const [docType, setDocType] = useState('all');

  console.log(documents);

  return (
    <ScrollView p={2}>
      <Text>Core: ok</Text>
      <Text>SDK status {status}</Text>
      <Text>Documents in the wallet {documents.length}</Text>
      <VStack space={2}>
        <Button
          onPress={() => {
            documents.forEach(doc => {
              wallet.remove(doc.id);
            });
          }}>
          Remove all docs
        </Button>
        <Button
          onPress={() => {
            wallet.accounts.create({
              name: 'Test Account',
            });
          }}>
          Add account
        </Button>
        <Button
          onPress={() => {
            Credentials.getInstance().add(testCredential);
          }}>
          Add credential
        </Button>
      </VStack>
      <Select
        selectedValue={docType}
        minWidth="200"
        accessibilityLabel="Choose doc type"
        placeholder="Choose doc type"
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={itemValue => setDocType(itemValue)}>
        <Select.Item label="All doc types" value="all" />
        <Select.Item label="Address" value="Address" />
        <Select.Item label="Mnemonic" value="Mnemonic" />
        <Select.Item label="Credential" value="VerifiableCredential" />
      </Select>
      {documents
        .filter(doc => {
          if (docType === 'all') {
            return true;
          }

          return doc.type === docType;
        })
        .map(item => (
          <VStack
            space="4"
            m={2}
            divider={<Divider />}
            bgColor={Theme.colors.secondaryBackground}
            p={2}>
            <Text fontSize="sm">ID: {item.id}</Text>
            <Text fontSize="sm">Type: {item.type}</Text>
            <Text fontSize="sm">Value: {item.value.toString()}</Text>
          </VStack>
        ))}
    </ScrollView>
  );
}

export function AppIntegrationTest() {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <Flex bgColor={Theme.colors.primaryBackground} h="100%">
      <CoreTest />
    </Flex>
  );
}
