import {Routes} from '../routes';
import {CredentialsContainer} from '../../features/credentials/CredentialsScreen';
import React from 'react';
import {getScreenProps} from './utils';
import {createStackNavigator} from '@react-navigation/stack';

const CredentialsNavigationStack = createStackNavigator();
export function CredentialsNavigationStackScreen() {
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
