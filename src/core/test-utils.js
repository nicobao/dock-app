import {NativeBaseProvider} from 'native-base';
import React from 'react';

export const renderAppProviders = component => {
  return <NativeBaseProvider>{component}</NativeBaseProvider>;
};

export const mockState = (rootKey, state) => {
  return () => ({
    [rootKey]: state,
  });
};

export const mockDispatch = result => () => result;
