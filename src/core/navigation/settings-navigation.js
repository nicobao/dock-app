import {Routes} from '../routes';
import {AppSettingsContainer} from '../../features/app/AppSettingsScreen';
import {DevSettingsContainer} from '../../features/dev-settings/DevSettingsScreen';
import {ExportWalletContainer} from '../../features/wallet/ExportWalletScreen';
import {UnlockWalletContainer} from '../../features/unlock-wallet/UnlockWalletScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getScreenProps} from './utils';

const SettingsNavigationStack = createStackNavigator();
export function SettingsNavigationStackScreen() {
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
