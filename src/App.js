import React, {useEffect} from 'react';
import {SENTRY_DSN} from '@env';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {Stack, useToast, View} from 'native-base';
import store from './core/redux-store';
import {NavigationRouter} from './core/NavigationRouter';
import {RNRpcWebView} from './rn-rpc-webview';
import {appOperations, appSelectors} from './features/app/app-slice';
import {
  ScreenContainer,
  Theme,
  ThemeProvider,
  Typography,
} from './design-system';
import {setToast} from './core/toast';
import {ConfirmationModal} from '../src/components/ConfirmationModal';
import {init as sentryInit} from '@sentry/react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {translate} from './locales';

try {
  sentryInit({
    dsn: SENTRY_DSN,
  });
} catch(err) {
  throw err;
}

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

function GlobalComponents() {
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(appOperations.initialize());
  }, [dispatch]);

  useEffect(() => {
    setToast(toast);
  }, [toast]);

  return (
    <View style={{flex: 1}}>
      <NavigationRouter />
      <View style={{height: 0}}>
        <RNRpcWebView
          onReady={() => {
            dispatch(appOperations.rpcReady());
          }}
        />
      </View>
      <ConfirmationModal />
    </View>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* <StyleProvider style={getTheme(material)}> */}
        <GlobalComponents />
        {/* <TestScreen /> */}
        {/* </StyleProvider> */}
      </ThemeProvider>
    </Provider>
  );
};

let exportedApp = App;

// if (APP_RUNTIME === 'storybook') {
// exportedApp = require('../storybook').default;
// }

export default exportedApp;
