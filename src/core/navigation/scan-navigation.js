import {Routes} from '../routes';
import {QRScanContainer} from '../../features/qr-code-scanner/QRScanScreen';
import {ShareCredentialScreenContainer} from '../../features/credentials/ShareCredentialScreen';
import {DIDAuthScreenContainer} from '../../features/didManagement/DIDAuthScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getScreenProps} from './utils';

const ScanNavigationStack = createStackNavigator();
export function ScanNavigationStackScreen() {
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
