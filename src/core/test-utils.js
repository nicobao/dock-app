import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import store from './redux-store';
import React from 'react';

const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

export const renderAppProviders = component => {
  return (
    <Provider store={store}>
      <NativeBaseProvider initialWindowMetrics={inset}>
        {component}
      </NativeBaseProvider>
    </Provider>
  );
};

export const mockState = (rootKey, state) => {
  return () => ({
    [rootKey]: state,
  });
};

export const mockDispatch = result => () => result;
