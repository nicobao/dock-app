import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {UnlockWalletContainer} from '../../features/unlock-wallet/UnlockWalletScreen';
import {Routes} from '../routes';

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

const AuthNavigationStack = createStackNavigator();

const getScreenProps = ({component, options = {}, name}) => {
  return {
    component: component,
    name: name,
    options: {
      ...screenOptions,
      ...options,
    },
  };
};

const screenOptions = {
  headerShown: false,
};
export function AuthNavigationStackScreen() {
  return (
    <AuthNavigationStack.Navigator initialRouteName={Routes.ACCOUNTS}>
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNTS,
          component: AccountsContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_SETTINGS,
          component: AppSettingsContainer,
          options: {
            gestureEnabled: false,
          },
          tab: 'settings',
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_FROM_MNEMONIC,
          component: ImportAccountFromMnemonicContainer,
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP,
          component: ImportAccountSetupContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP_PASSWORD,
          component: ImportAccountPasswordContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_EXPORT_SETUP_PASSWORD,
          component: ExportAccountPasswordContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_DETAILS,
          component: AccountDetailsContainer,
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.TRADE_BUY_DOCK,
          component: BuyDockScreenContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_QR_SCANNER,
          component: QRScanContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_DID_AUTH,
          component: DIDAuthScreenContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_SETUP,
          component: CreateAccountSetupContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DEV_SETTINGS,
          component: DevSettingsContainer,
          tab: 'settings',
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_MNEMONIC,
          component: CreateAccountMnemonicContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_BACKUP,
          component: CreateAccountBackupContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_VERIFY_PHRASE,
          component: CreateAccountVerifyPhraseContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.WALLET_EXPORT_BACKUP,
          component: ExportWalletContainer,
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.TOKEN_RECEIVE,
          component: ReceiveTokenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.TOKEN_SEND,
          component: SendTokenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CONFIRM_WALLET_ACCESS,
          component: UnlockWalletContainer,
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.APP_CREDENTIALS,
          component: CredentialsContainer,
          tab: 'credentials',
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_LIST,
          component: DIDListScreenContainer,
          tab: 'did-management',
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_NEW_DID,
          component: CreateNewDIDScreenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_EDIT_DID,
          component: EditDIDScreenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_SHARE_DID,
          component: ShareDIDScreenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />

      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_EXPORT_DID,
          component: ExportDIDScreenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.DID_MANAGEMENT_IMPORT_DID,
          component: ImportDIDScreenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AuthNavigationStack.Screen
        {...getScreenProps({
          name: Routes.CREDENTIALS_SHARE_AS_PRESENTATION,
          component: ShareCredentialScreenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
    </AuthNavigationStack.Navigator>
  );
}
