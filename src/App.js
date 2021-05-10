import React from 'react';
import {Provider, useDispatch} from 'react-redux';
import {Root, StyleProvider, View} from 'native-base';
import store from './core/redux-store';
import {NavigationRouter} from './core/NavigationRouter';
// @ts-ignore
import {getTheme} from 'native-base/src';
import material from './theme/variables/material';
import {TestScreen} from './TestScreen';
import { walletsActions, walletsOperations } from './features/wallets/wallets-slice';
import { RNRpcWebView } from './rn-rpc-webview';

function GlobalComponents() {
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
        <NavigationRouter />
      <View style={{ height: 0 }}>
        <RNRpcWebView
          onReady={() => {
            dispatch(walletsOperations.initialize());
          }}
        />
      </View>
    </View>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <StyleProvider style={getTheme(material)}>
        <Root>
          
          <GlobalComponents />
          {/* <TestScreen /> */}
        </Root>
      </StyleProvider>
    </Provider>
  );
};

export default App;

