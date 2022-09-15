import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {UnlockWalletContainer} from '../../features/unlock-wallet/UnlockWalletScreen';
import {Routes} from '../routes';
import {StyleSheet} from 'react-native';
import {AccountsContainer} from '../../features/accounts/AccountsScreen';
import {AppSettingsContainer} from '../../features/app/AppSettingsScreen';
import {ImportAccountFromMnemonicContainer} from '../../features/accounts/ImportAccountFromMnemonicScreen';
import {ImportAccountSetupContainer} from '../../features/accounts/ImportAccountSetupScreen';
import {ImportAccountPasswordContainer} from '../../features/accounts/ImportAccountPasswordScreen';
import {ExportAccountPasswordContainer} from '../../features/accounts/ExportAccountPasswordScreen';
import {AccountDetailsContainer} from '../../features/accounts/AccountDetailsScreen';
import {BuyDockScreenContainer} from '../../features/trade/BuyDockScreen';
import {QRScanContainer} from '../../features/qr-code-scanner/QRScanScreen';
import {DIDAuthScreenContainer} from '../../features/didManagement/DIDAuthScreen';
import {CreateAccountSetupContainer} from '../../features/account-creation/CreateAccountSetupScreen';
import {DevSettingsContainer} from '../../features/dev-settings/DevSettingsScreen';
import {CreateAccountMnemonicContainer} from '../../features/account-creation/CreateAccountMnemonicScreen';
import {CreateAccountBackupContainer} from '../../features/account-creation/CreateAccountBackupScreen';
import {CreateAccountVerifyPhraseContainer} from '../../features/account-creation/CreateAccountVerifyPhraseScreen';
import {ExportWalletContainer} from '../../features/wallet/ExportWalletScreen';
import {ReceiveTokenContainer} from '../../features/tokens/ReceiveTokenScreen';
import {SendTokenContainer} from '../../features/tokens/SendTokenScreen';
import {CredentialsContainer} from '../../features/credentials/CredentialsScreen';
import {DIDListScreenContainer} from '../../features/didManagement/DIDListScreen';
import {CreateNewDIDScreenContainer} from '../../features/didManagement/CreateNewDIDScreen';
import {EditDIDScreenContainer} from '../../features/didManagement/EditDIDScreen';
import {ShareDIDScreenContainer} from '../../features/didManagement/ShareDIDScreen';
import {ExportDIDScreenContainer} from '../../features/didManagement/ExportDIDScreen';
import {ImportDIDScreenContainer} from '../../features/didManagement/ImportDIDScreen';
import {ShareCredentialScreenContainer} from '../../features/credentials/ShareCredentialScreen';
import {View} from 'react-native';
import {
  DIDManagementIcon,
  MenuCredentialsIcon,
  MenuScanQRIcon,
  MenuSettingsIcon,
  MenuTokensIcon,
  Theme,
} from '../../design-system';
import {translate} from '../../locales';
import {useFeatures} from '../../features/app/feature-flags';

const Tab = createBottomTabNavigator();

const TokenNavigationStack = createStackNavigator();
const CredentialsNavigationStack = createStackNavigator();
const ScanNavigationStack = createStackNavigator();
const DIDNavigationStack = createStackNavigator();
const SettingsNavigationStack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};
const getScreenProps = ({component, options = {}, name}) => {
  return {
    component: component,
    name: name,
    options: {
      gestureEnabled: false,
      ...screenOptions,
      ...options,
    },
  };
};

function TokenNavigationStackScreen() {
  return (
    <TokenNavigationStack.Navigator initialRouteName={Routes.ACCOUNTS}>
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNTS,
          component: AccountsContainer,
          options: {
            headerShown: false,
          },
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_DETAILS,
          component: AccountDetailsContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_FROM_MNEMONIC,
          component: ImportAccountFromMnemonicContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP,
          component: ImportAccountSetupContainer,
        })}
      />

      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP_PASSWORD,
          component: ImportAccountPasswordContainer,
        })}
      />

      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_EXPORT_SETUP_PASSWORD,
          component: ExportAccountPasswordContainer,
        })}
      />

      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.TRADE_BUY_DOCK,
          component: BuyDockScreenContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_SETUP,
          component: CreateAccountSetupContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_MNEMONIC,
          component: CreateAccountMnemonicContainer,
        })}
      />

      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_BACKUP,
          component: CreateAccountBackupContainer,
        })}
      />

      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_VERIFY_PHRASE,
          component: CreateAccountVerifyPhraseContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.TOKEN_RECEIVE,
          component: ReceiveTokenContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.TOKEN_SEND,
          component: SendTokenContainer,
        })}
      />
      <TokenNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_QR_SCANNER,
          component: QRScanContainer,
          options: {
            headerShown: true,
          },
        })}
      />
    </TokenNavigationStack.Navigator>
  );
}
function CredentialsNavigationStackScreen() {
  return (
    <CredentialsNavigationStack.Navigator
      initialRouteName={Routes.APP_CREDENTIALS}>
      <CredentialsNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_CREDENTIALS,
          component: CredentialsContainer,
          options: {
            headerShown: false,
          },
        })}
      />
    </CredentialsNavigationStack.Navigator>
  );
}
function ScanNavigationStackScreen() {
  return (
    <ScanNavigationStack.Navigator initialRouteName={Routes.APP_QR_SCANNER}>
      <ScanNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_QR_SCANNER,
          component: QRScanContainer,
          options: {
            headerShown: false,
          },
        })}
      />
      <ScanNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREDENTIALS_SHARE_AS_PRESENTATION,
          component: ShareCredentialScreenContainer,
        })}
      />
      <ScanNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_DID_AUTH,
          component: DIDAuthScreenContainer,
        })}
      />
    </ScanNavigationStack.Navigator>
  );
}
function DIDNavigationStackScreen() {
  return (
    <DIDNavigationStack.Navigator initialRouteName={Routes.DID_MANAGEMENT_LIST}>
      <DIDNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_LIST,
          component: DIDListScreenContainer,
          options: {
            headerShown: false,
          },
        })}
      />

      <DIDNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_NEW_DID,
          component: CreateNewDIDScreenContainer,
        })}
      />

      <DIDNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_EDIT_DID,
          component: EditDIDScreenContainer,
        })}
      />

      <DIDNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_SHARE_DID,
          component: ShareDIDScreenContainer,
        })}
      />

      <DIDNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_EXPORT_DID,
          component: ExportDIDScreenContainer,
        })}
      />
      <DIDNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_IMPORT_DID,
          component: ImportDIDScreenContainer,
        })}
      />
    </DIDNavigationStack.Navigator>
  );
}
function SettingsNavigationStackScreen() {
  return (
    <SettingsNavigationStack.Navigator initialRouteName={Routes.APP_SETTINGS}>
      <SettingsNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_SETTINGS,
          component: AppSettingsContainer,
          options: {
            headerShown: false,
          },
        })}
      />
      <SettingsNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DEV_SETTINGS,
          component: DevSettingsContainer,
        })}
      />
      <SettingsNavigationStack.Screen
        {...getScreenProps({
          name: Routes.WALLET_EXPORT_BACKUP,
          component: ExportWalletContainer,
        })}
      />
      <SettingsNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CONFIRM_WALLET_ACCESS,
          component: UnlockWalletContainer,
        })}
      />
    </SettingsNavigationStack.Navigator>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    backgroundColor: Theme.screen.backgroundColor,
    borderTopWidth: 0,
    elevation: 0,
  },
});
function TabNavigatorScreen() {
  const {features} = useFeatures();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarBackground: () => <View style={styles.tabBar} />,
      }}>
      <Tab.Screen
        name={translate('app_navigation.tokens')}
        component={TokenNavigationStackScreen}
        options={{
          ...screenOptions,
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <MenuTokensIcon
              style={{
                color: focused ? undefined : Theme.colors.text,
              }}
            />
          ),
        }}
      />
      {features.credentials && (
        <Tab.Screen
          name={translate('app_navigation.credentials')}
          component={CredentialsNavigationStackScreen}
          options={{
            ...screenOptions,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <MenuCredentialsIcon
                style={{
                  color: focused ? undefined : Theme.colors.text,
                }}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name={translate('app_navigation.scan')}
        component={ScanNavigationStackScreen}
        options={{
          ...screenOptions,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MenuScanQRIcon
              style={{
                color: focused ? undefined : Theme.colors.text,
              }}
            />
          ),
        }}
      />
      {features.didManagement && (
        <Tab.Screen
          name={translate('app_navigation.did_management')}
          component={DIDNavigationStackScreen}
          options={{
            ...screenOptions,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <DIDManagementIcon
                style={{
                  color: focused ? undefined : Theme.colors.text,
                }}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name={translate('app_navigation.settings')}
        component={SettingsNavigationStackScreen}
        options={{
          ...screenOptions,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MenuSettingsIcon
              style={{
                color: focused ? undefined : Theme.colors.text,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export function AuthNavigationStackScreen() {
  return <TabNavigatorScreen />;
}
