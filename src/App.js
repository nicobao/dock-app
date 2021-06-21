import React, {useEffect} from 'react';
import {APP_RUNTIME} from '@env';
import {Provider, useDispatch} from 'react-redux';
import {Root, StyleProvider, View} from 'native-base';
import store from './core/redux-store';
import {NavigationRouter} from './core/NavigationRouter';
// @ts-ignore
import {getTheme} from 'native-base/src';
import material from './theme/variables/material';
import {walletsOperations} from './features/wallets/wallets-slice';
import {RNRpcWebView} from './rn-rpc-webview';
import {ConfirmConnectionModal} from './features/wallet-connect/ConfirmConnectionModal';
import {ThemeProvider} from 'styled-components/native';
import {Theme} from './design-system';
import {appOperations} from './features/app/app-slice';

function GlobalComponents() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appOperations.initialize());
  });

  return (
    <View style={{flex: 1}}>
      <NavigationRouter />
      <View style={{height: 0}}>
        <RNRpcWebView
          onReady={() => {
            dispatch(walletsOperations.initialize());
          }}
        />
      </View>
      <ConfirmConnectionModal />
    </View>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <StyleProvider style={getTheme(material)}>
          <Root>
            <GlobalComponents />
            {/* <TestScreen /> */}
          </Root>
        </StyleProvider>
      </ThemeProvider>
    </Provider>
  );
};

let exportedApp = App;

// if (APP_RUNTIME === 'storybook') {
// exportedApp = require('../storybook').default;
// }

export default exportedApp;
