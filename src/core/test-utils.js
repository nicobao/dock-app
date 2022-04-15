import {NativeBaseProvider} from 'native-base';
import React from 'react';

const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

export const renderAppProviders = component => {
  return (
    <NativeBaseProvider initialWindowMetrics={inset}>
      {component}
    </NativeBaseProvider>
  );
};

export const mockState = (rootKey, state) => {
  return () => ({
    [rootKey]: state,
  });
};

export const mockDispatch = result => () => result;
