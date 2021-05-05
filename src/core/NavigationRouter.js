import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {CreateWalletScreen} from '../features/wallets/CreateWalletScreen';
import {CreateWalletMnemonicScreen} from '../features/wallets/CreateWalletMnemonicScreen';
import {navigate, navigationRef} from './navigation';
import {Routes} from './routes';
import {useDispatch} from 'react-redux';
import {walletsOperations} from '../features/wallets/wallets-slice';
import {UnlockWalletScreen} from '../features/wallets/UnlockWalletScreen';
import {HomeScreen} from '../features/home/HomeScreen';
import {DIDListScreen} from '../features/did/DIDListScreen';
import {Icon, View} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';
import {Colors} from '../theme/colors';
import {SettingsScreen} from '../features/settings/SettingsScreen';
import {CredentialListScreen} from '../features/credentials/CredentialListScreen';

const getMainOptions = opts => {
  return {
    headerStyle: {
      backgroundColor: Colors.darkBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitle: 'Back',
    headerRight: () => (
      <React.Fragment>
        <View style={{flexDirection: 'row', paddingRight: 10}}>
          <View style={{marginRight: 12}}>
            <TouchableWithoutFeedback onPress={() => alert('Available soon!')}>
              <Icon size={30} name="scan-outline" style={{color: '#fff'}} />
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback
            onPress={() => navigate(Routes.APP_SETTINGS)}>
            <Icon size={30} name="settings" style={{color: '#fff'}} />
          </TouchableWithoutFeedback>
        </View>
      </React.Fragment>
    ),
    ...opts,
  };
};

const AppStack = createStackNavigator();
const RootStack = createStackNavigator();

function AppStackScreen() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name={Routes.UNLOCK_WALLET}
        component={UnlockWalletScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET}
        component={CreateWalletScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET_MNEMONIC}
        component={CreateWalletMnemonicScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_HOME}
        component={HomeScreen}
        options={{
          ...getMainOptions({
            title: 'Welcome',
            headerLeft: null,
          }),
        }}
      />
      <AppStack.Screen
        name={Routes.APP_DID}
        component={DIDListScreen}
        options={{
          ...getMainOptions({
            title: 'DIDs',
          }),
        }}
      />
      <AppStack.Screen
        name={Routes.APP_CREDENTIAL}
        component={CredentialListScreen}
        options={{
          ...getMainOptions({
            title: 'Credentials',
          }),
        }}
      />
      <AppStack.Screen
        name={Routes.APP_SETTINGS}
        component={SettingsScreen}
        options={{
          ...getMainOptions({
            title: 'Settings',
            headerRight: null,
          }),
        }}
      />
    </AppStack.Navigator>
  );
}

export function NavigationRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(walletsOperations.initialize());
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="app"
          component={AppStackScreen}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
