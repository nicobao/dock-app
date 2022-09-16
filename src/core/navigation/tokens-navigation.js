import {Routes} from '../routes';
import {AccountsContainer} from '../../features/accounts/AccountsScreen';
import {AccountDetailsContainer} from '../../features/accounts/AccountDetailsScreen';
import {ImportAccountFromMnemonicContainer} from '../../features/accounts/ImportAccountFromMnemonicScreen';
import {ImportAccountSetupContainer} from '../../features/accounts/ImportAccountSetupScreen';
import {ImportAccountPasswordContainer} from '../../features/accounts/ImportAccountPasswordScreen';
import {ExportAccountPasswordContainer} from '../../features/accounts/ExportAccountPasswordScreen';
import {BuyDockScreenContainer} from '../../features/trade/BuyDockScreen';
import {CreateAccountSetupContainer} from '../../features/account-creation/CreateAccountSetupScreen';
import {CreateAccountMnemonicContainer} from '../../features/account-creation/CreateAccountMnemonicScreen';
import {CreateAccountBackupContainer} from '../../features/account-creation/CreateAccountBackupScreen';
import {CreateAccountVerifyPhraseContainer} from '../../features/account-creation/CreateAccountVerifyPhraseScreen';
import {ReceiveTokenContainer} from '../../features/tokens/ReceiveTokenScreen';
import {SendTokenContainer} from '../../features/tokens/SendTokenScreen';
import {QRScanContainer} from '../../features/qr-code-scanner/QRScanScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getScreenProps} from './utils';

const TokenNavigationStack = createStackNavigator();
export function TokenNavigationStackScreen() {
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
