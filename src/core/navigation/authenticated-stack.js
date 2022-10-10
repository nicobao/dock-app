import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text} from 'react-native';

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
import {Routes} from '../routes';

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
      {features.accounts && (
        <Tab.Screen
          name={Routes.ACCOUNTS}
          component={TokenNavigationStackScreen}
          options={{
            ...screenOptions,
            tabBarLabel: ({color, size, focused}) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? Theme.colors.tabTextHighlightColor
                      : Theme.colors.tabTextUnHighlightColor,
                    fontSize: 10,
                  }}>
                  {translate('app_navigation.tokens')}
                </Text>
              );
            },
            headerShown: false,
            tabBarIcon: ({color, size, focused}) => (
              <MenuTokensIcon
                style={{
                  color: focused
                    ? Theme.colors.tabIconHighlightColor
                    : Theme.colors.tabIconUnHighlightColor,
                }}
              />
            ),
          }}
        />
      )}

      {features.credentials && (
        <Tab.Screen
          name={Routes.APP_CREDENTIALS}
          component={CredentialsNavigationStackScreen}
          options={{
            ...screenOptions,
            headerShown: false,
            tabBarLabel: ({color, size, focused}) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? Theme.colors.tabTextHighlightColor
                      : Theme.colors.tabTextUnHighlightColor,
                    fontSize: 10,
                  }}>
                  {translate('app_navigation.credentials')}
                </Text>
              );
            },
            tabBarIcon: ({focused}) => (
              <MenuCredentialsIcon
                style={{
                  color: focused
                    ? Theme.colors.tabIconHighlightColor
                    : Theme.colors.tabIconUnHighlightColor,
                }}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name={Routes.APP_QR_SCANNER}
        component={ScanNavigationStackScreen}
        options={{
          ...screenOptions,
          headerShown: false,
          tabBarLabel: ({color, size, focused}) => {
            return (
              <Text
                style={{
                  color: focused
                    ? Theme.colors.tabTextHighlightColor
                    : Theme.colors.tabTextUnHighlightColor,
                  fontSize: 10,
                }}>
                {translate('app_navigation.scan')}
              </Text>
            );
          },
          tabBarIcon: ({focused}) => (
            <MenuScanQRIcon
              style={{
                color: focused
                  ? Theme.colors.tabIconHighlightColor
                  : Theme.colors.tabIconUnHighlightColor,
              }}
            />
          ),
        }}
      />
      {features.didManagement && (
        <Tab.Screen
          name={Routes.DID_MANAGEMENT_LIST}
          component={DIDNavigationStackScreen}
          options={{
            ...screenOptions,
            headerShown: false,
            tabBarLabel: ({color, size, focused}) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? Theme.colors.tabTextHighlightColor
                      : Theme.colors.tabTextUnHighlightColor,
                    fontSize: 10,
                  }}>
                  {translate('app_navigation.did_management')}
                </Text>
              );
            },
            tabBarIcon: ({focused}) => (
              <DIDManagementIcon
                style={{
                  color: focused
                    ? Theme.colors.tabIconHighlightColor
                    : Theme.colors.tabIconUnHighlightColor,
                }}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name={Routes.APP_SETTINGS}
        component={SettingsNavigationStackScreen}
        options={{
          ...screenOptions,
          headerShown: false,
          tabBarLabel: ({color, size, focused}) => {
            return (
              <Text
                style={{
                  color: focused
                    ? Theme.colors.tabTextHighlightColor
                    : Theme.colors.tabTextUnHighlightColor,
                  fontSize: 10,
                }}>
                {translate('app_navigation.settings')}
              </Text>
            );
          },
          tabBarIcon: ({focused}) => (
            <MenuSettingsIcon
              style={{
                color: focused
                  ? Theme.colors.tabIconHighlightColor
                  : Theme.colors.tabIconUnHighlightColor,
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
