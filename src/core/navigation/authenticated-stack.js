import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';

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
import {TokenNavigationStackScreen} from './tokens-navigation';
import {CredentialsNavigationStackScreen} from './credentials-navigation';
import {ScanNavigationStackScreen} from './scan-navigation';
import {DIDNavigationStackScreen} from './did-navigation';
import {SettingsNavigationStackScreen} from './settings-navigation';

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    backgroundColor: Theme.screen.backgroundColor,
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
