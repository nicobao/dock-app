import React from 'react';
import {Provider} from 'react-redux';
import {StyleProvider} from 'native-base';
import store from './core/redux-store';
import {NavigationRouter} from './core/NavigationRouter';
// @ts-ignore
import {getTheme} from 'native-base/src';
import material from './theme/variables/material';

const App = () => {
  return (
    <Provider store={store}>
      <StyleProvider style={getTheme(material)}>
        <NavigationRouter />
      </StyleProvider>
    </Provider>
  );
};

export default App;
