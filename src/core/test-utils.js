import {NativeBaseProvider} from 'native-base';
import React from 'react';

export const renderAppProviders = component => {
  return <NativeBaseProvider>{component}</NativeBaseProvider>;
};
