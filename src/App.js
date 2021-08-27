import React, {useEffect} from 'react';
import {SENTRY_DSN} from '@env';
import {Provider, useDispatch} from 'react-redux';
import {useToast, View} from 'native-base';
import store from './core/redux-store';
import {NavigationRouter} from './core/NavigationRouter';
import {RNRpcWebView} from './rn-rpc-webview';
import {appOperations} from './features/app/app-slice';
import {ThemeProvider} from './design-system';
import {setToast} from './core/toast';
import {ConfirmationModal} from '../src/components/ConfirmationModal';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: SENTRY_DSN,
});

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
