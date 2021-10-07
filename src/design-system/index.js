import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { appSelectors } from 'src/features/app/app-slice';
import styled from 'styled-components/native';
import {Box} from './grid';
import {Theme} from './theme';

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

export function ScreenContainer({children, hideGlobalHeader}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Theme.colors.primaryBackground,
      }}>
      {hideGlobalHeader ? null : <AppGlobalHeader />}
      {children}
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
