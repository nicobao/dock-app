import {NavigationContainer} from '@react-navigation/native';

import React, {useEffect} from 'react';
import {Linking, Platform} from 'react-native';

import {navigationRef} from './navigation';

import DeepLinking from 'react-native-deep-linking';

import {authenticationSelectors} from '../features/unlock-wallet/unlock-wallet-slice';
import {useSelector} from 'react-redux';
import {useDeepLink} from './hooks/deepLinkHooks';
import {UnAuthNavigationStackScreen} from './navigation/unauthenticated-stack';
import {AuthNavigationStackScreen} from './navigation/authenticated-stack';

const forFade = ({current, closing}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const screenOptions = {
  headerShown: false,
};

if (Platform.OS === 'android') {
  screenOptions.cardStyleInterpolator = forFade;
}

export function NavigationRouter() {
  const isLoggedIn = useSelector(authenticationSelectors.isLoggedIn);
  const {gotoScreenDeepLink} = useDeepLink({isLoggedIn});

  useEffect(() => {
    const getAsyncURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl !== undefined && initialUrl != null) {
        gotoScreenDeepLink({url: initialUrl});
      }
    };

    getAsyncURL();
  }, [gotoScreenDeepLink]);

  useEffect(() => {
    DeepLinking.addScheme('dockwallet://');
    Linking.addEventListener('url', gotoScreenDeepLink);

    return () => {
      Linking.removeEventListener('url', gotoScreenDeepLink);
    };
  }, [gotoScreenDeepLink]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? (
        <AuthNavigationStackScreen />
      ) : (
        <UnAuthNavigationStackScreen />
      )}
    </NavigationContainer>
  );
}
