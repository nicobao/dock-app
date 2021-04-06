import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {CreateWalletScreen} from '../features/wallets/CreateWalletScreen';
import {CreateWalletMnemonicScreen} from '../features/wallets/CreateWalletMnemonicScreen';
import {navigationRef} from './navigation';
import {Routes} from './routes';
import {useDispatch} from 'react-redux';
import {walletsOperations} from '../features/wallets/walletsSlice';
import {UnlockWalletScreen} from '../features/wallets/UnlockWalletScreen';
import {HomeScreen} from '../features/home/HomeScreen';

const getMainOptions = opts => {
  return {
    headerStyle: {
      backgroundColor: '#222',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitle: 'Back',
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
          headerShown: false,
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
