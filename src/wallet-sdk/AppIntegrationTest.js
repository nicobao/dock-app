import React, {useContext, useEffect} from 'react';
import {
  useWallet,
  WalletSDKContext,
} from '@docknetwork/wallet-sdk-react-native/lib';
import {
  Divider,
  Flex,
  ScrollView,
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

  console.log(documents);

  return (
    <ScrollView p={2}>
      <Text>Core: ok</Text>
      <Text>SDK status {status}</Text>
      <Text>Documents in the wallet {documents.length}</Text>
      {documents.map(item => (
        <VStack
          space="4"
          m={2}
          divider={<Divider />}
          bgColor={Theme.colors.secondaryBackground}
          p={2}
        >
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
