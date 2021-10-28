import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'native-base';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Theme} from 'src/design-system';
import {ReceiveTokenContainer} from 'src/features/tokens/ReceiveTokenScreen';
import {SendTokenContainer} from 'src/features/tokens/SendTokenScreen';
import {CreateAccountBackupContainer} from '../features/account-creation/CreateAccountBackupScreen';
import {CreateAccountMnemonicContainer} from '../features/account-creation/CreateAccountMnemonicScreen';
import {CreateAccountSetupContainer} from '../features/account-creation/CreateAccountSetupScreen';
import {CreateAccountVerifyPhraseContainer} from '../features/account-creation/CreateAccountVerifyPhraseScreen';
import {AccountDetailsContainer} from '../features/accounts/AccountDetailsScreen';
import {AccountsContainer} from '../features/accounts/AccountsScreen';
import {ExportAccountPasswordContainer} from '../features/accounts/ExportAccountPasswordScreen';
import {ImportAccountFromMnemonicContainer} from '../features/accounts/ImportAccountFromMnemonicScreen';
import {ImportAccountPasswordContainer} from '../features/accounts/ImportAccountPasswordScreen';
import {ImportAccountSetupContainer} from '../features/accounts/ImportAccountSetupScreen';
import {AppSettingsContainer} from '../features/app/AppSettingsScreen';
import {SplashScreen} from '../features/app/SplashScreen';
import {QRScanScreen} from '../features/qr-code-scanner/QRScanScreen';
import {UnlockWalletContainer} from '../features/unlock-wallet/UnlockWalletScreen';
import {CreatePasscodeContainer} from '../features/wallet/CreatePasscodeScreen';
import {CreateWalletScreen} from '../features/wallet/CreateWalletScreen';
import {ExportWalletContainer} from '../features/wallet/ExportWalletScreen';
import {ImportWalletPasswordContainer} from '../features/wallet/ImportWalletPasswordScreen';
import {ImportWalletContainer} from '../features/wallet/ImportWalletScreen';
import {ProtectYourWalletContainer} from '../features/wallet/ProtectYourWalletScreen';
import {SetupPasscodeScreen} from '../features/wallet/SetupPasscodeScreen';
import {navigationRef} from './navigation';
import {Routes} from './routes';

const AppStack = createStackNavigator();
const RootStack = createStackNavigator();

const forFade = ({current, closing}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const screenOptions = {
  headerShown: false,
};

if (Platform.OS === 'android') {
  screenOptions.cardStyleInterpolator = forFade;
}

const styles = StyleSheet.create({
  cardOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.primaryBackground,
  },
});

function AppStackScreen() {
  return (
    <AppStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: Theme.colors.primaryBackground,
        },
        cardOverlay: () => <View style={styles.cardOverlay} />,
      }}>
      <AppStack.Screen
        name={Routes.SPLASH_SCREEN}
        component={SplashScreen}
        options={{
          ...screenOptions,

          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET}
        component={CreateWalletScreen}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_SETTINGS}
        component={AppSettingsContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET_PASSCODE_SETUP}
        component={SetupPasscodeScreen}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNT_IMPORT_FROM_MNEMONIC}
        component={ImportAccountFromMnemonicContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNT_IMPORT_SETUP}
        component={ImportAccountSetupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.ACCOUNT_IMPORT_SETUP_PASSWORD}
        component={ImportAccountPasswordContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.ACCOUNT_EXPORT_SETUP_PASSWORD}
        component={ExportAccountPasswordContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_WALLET_PASSCODE}
        component={CreatePasscodeContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET_PROTECT}
        component={ProtectYourWalletContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.UNLOCK_WALLET}
        component={UnlockWalletContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNTS}
        component={AccountsContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNT_DETAILS}
        component={AccountDetailsContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.APP_QR_SCANNER}
        component={QRScanScreen}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_SETUP}
        component={CreateAccountSetupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_MNEMONIC}
        component={CreateAccountMnemonicContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_BACKUP}
        component={CreateAccountBackupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_VERIFY_PHRASE}
        component={CreateAccountVerifyPhraseContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.WALLET_EXPORT_BACKUP}
        component={ExportWalletContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.WALLET_IMPORT_BACKUP}
        component={ImportWalletContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.WALLET_IMPORT_BACKUP_PASSWORD}
        component={ImportWalletPasswordContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.TOKEN_RECEIVE}
        component={ReceiveTokenContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.TOKEN_SEND}
        component={SendTokenContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.CONFIRM_WALLET_ACCESS}
        component={UnlockWalletContainer}
        options={{
          ...screenOptions,
        }}
      />
    </AppStack.Navigator>
  );
}

export function NavigationRouter() {
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
