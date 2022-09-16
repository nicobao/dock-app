import {Routes} from '../routes';
import {DIDListScreenContainer} from '../../features/didManagement/DIDListScreen';
import {CreateNewDIDScreenContainer} from '../../features/didManagement/CreateNewDIDScreen';
import {EditDIDScreenContainer} from '../../features/didManagement/EditDIDScreen';
import {ShareDIDScreenContainer} from '../../features/didManagement/ShareDIDScreen';
import {ExportDIDScreenContainer} from '../../features/didManagement/ExportDIDScreen';
import {ImportDIDScreenContainer} from '../../features/didManagement/ImportDIDScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getScreenProps} from './utils';

const DIDNavigationStack = createStackNavigator();
export function DIDNavigationStackScreen() {
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
