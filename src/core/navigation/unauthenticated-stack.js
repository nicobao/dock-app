import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {UnlockWalletContainer} from '../../features/unlock-wallet/UnlockWalletScreen';
import {Routes} from '../routes';
import {CreateWalletScreen} from '../../features/wallet/CreateWalletScreen';
import {SetupPasscodeScreen} from '../../features/wallet/SetupPasscodeScreen';
import {CreatePasscodeContainer} from '../../features/wallet/CreatePasscodeScreen';
import {ImportWalletContainer} from '../../features/wallet/ImportWalletScreen';
import {ImportWalletPasswordContainer} from '../../features/wallet/ImportWalletPasswordScreen';
import {ProtectYourWalletContainer} from '../../features/wallet/ProtectYourWalletScreen';
import {SplashScreen} from '../../features/app/SplashScreen';

const UnAuthNavigationStack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};
export function UnAuthNavigationStackScreen() {
  return (
    <UnAuthNavigationStack.Navigator initialRouteName={Routes.SPLASH_SCREEN}>
      <UnAuthNavigationStack.Screen
        name={Routes.SPLASH_SCREEN}
        component={SplashScreen}
        options={screenOptions}
      />
      <UnAuthNavigationStack.Screen
        name={Routes.UNLOCK_WALLET}
        component={UnlockWalletContainer}
        options={screenOptions}
      />

      <UnAuthNavigationStack.Screen
        name={Routes.CREATE_WALLET}
        component={CreateWalletScreen}
        options={screenOptions}
      />
      <UnAuthNavigationStack.Screen
        name={Routes.CREATE_WALLET_PASSCODE_SETUP}
        component={SetupPasscodeScreen}
        options={screenOptions}
      />
      <UnAuthNavigationStack.Screen
        name={Routes.CREATE_WALLET_PASSCODE}
        component={CreatePasscodeContainer}
        options={screenOptions}
      />
      <UnAuthNavigationStack.Screen
        name={Routes.WALLET_IMPORT_BACKUP}
        component={ImportWalletContainer}
        options={screenOptions}
      />
      <UnAuthNavigationStack.Screen
        name={Routes.WALLET_IMPORT_BACKUP_PASSWORD}
        component={ImportWalletPasswordContainer}
        options={screenOptions}
      />
      <UnAuthNavigationStack.Screen
        name={Routes.CREATE_WALLET_PROTECT}
        component={ProtectYourWalletContainer}
        options={screenOptions}
      />
    </UnAuthNavigationStack.Navigator>
  );
}
