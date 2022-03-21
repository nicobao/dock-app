import {Stack, Box, Text, Pressable} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {appSelectors} from 'src/features/app/app-slice';
import {translate} from 'src/locales';
import styled from 'styled-components/native';
import {Theme} from './theme';
import {Typography} from './typography';
import {Routes} from '../core/routes';
import {navigate} from '../core/navigation';
import {
  MenuCredentialsIcon,
  MenuScanQRIcon,
  MenuSettingsIcon,
  MenuTokensIcon,
} from '../assets/icons';

function ConnectionStatus({status, loadingText, errorText}) {
  if (!status && loadingText) {
    return (
      <Stack bg={Theme.colors.info} p={2}>
        <Typography color={Theme.colors.info2}>{loadingText}</Typography>
      </Stack>
    );
  }

  if (status instanceof Error && errorText) {
    return (
      <Stack bg={Theme.colors.error} p={2}>
        <Typography color={Theme.colors.errorText}>{errorText}</Typography>
      </Stack>
    );
  }

  return null;
}

export function AppGlobalHeader() {
  const dockApiReady = useSelector(appSelectors.getDockReady);
  const rpcReady = useSelector(appSelectors.getRpcReady);

  return (
    <>
      <ConnectionStatus
        status={rpcReady}
        errorText={translate('global.webview_connection_error')}
      />
      <ConnectionStatus
        status={dockApiReady}
        loadingText={translate('global.substrate_connection_loading')}
        errorText={translate('global.substrate_connection_error')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Theme.colors.primaryBackground,
  },
});

const menuOptions = [
  {
    id: 'tokens',
    route: Routes.ACCOUNTS,
    name: translate('app_navigation.tokens'),
    Icon: MenuTokensIcon,
  },
  {
    id: 'credentials',
    route: Routes.APP_SETTINGS,
    name: translate('app_navigation.credentials'),
    Icon: MenuCredentialsIcon,
  },
  {
    id: 'scan-qr',
    route: Routes.APP_QR_SCANNER,
    name: translate('app_navigation.scan'),
    Icon: MenuScanQRIcon,
  },
  {
    id: 'settings',
    route: Routes.APP_SETTINGS,
    name: translate('app_navigation.settings'),
    Icon: MenuSettingsIcon,
  },
];

function TabNavigation() {
  const currentTab = 'tokens';

  return (
    <Stack direction="row">
      {menuOptions.map(option => (
        <Pressable
          key={option.id}
          flex={1}
          onPress={() => navigate(option.route)}
          justifyContent={'center'}
          alignItems={'center'}>
          <option.Icon
            color={
              option.id === currentTab
                ? Theme.colors.info2
                : Theme.colors.description
            }
          />
          <Text fontSize="12px" mt={1}>
            {option.name}
          </Text>
        </Pressable>
      ))}
    </Stack>
  );
}
export function ScreenContainer({
  children,
  hideGlobalHeader,
  showTabNavigation,
  ...props
}) {
  return (
    <SafeAreaView {...props} style={styles.screenContainer}>
      {hideGlobalHeader ? null : <AppGlobalHeader />}
      <Box flex={1}>
        <Box flex={1}>{children}</Box>
        {showTabNavigation ? (
          <Box flex={1} flexGrow={0.05}>
            <TabNavigation />
          </Box>
        ) : null}
      </Box>
    </SafeAreaView>
  );
}

export const Header = styled.View`
  padding: 22px 6px;
`;
export const Footer = styled(Box)``;
export const Content = styled(ScrollView)`
  flex: 1;
`;

export const Image = styled.Image``;

export * from '../assets/icons';
export * from './buttons';
export * from './grid';
export * from './inputs';
export * from './list';
export * from './LoadingScreen';
export * from './theme';
export * from './typography';
