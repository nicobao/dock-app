import {authHandler} from '../qr-code-scanner/qr-code';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ScreenContainer, Typography} from '../../design-system';
import {Spinner} from 'native-base';
import {translate} from '../../locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';

export function DIDAuthScreen({authState}) {
  return (
    <ScreenContainer testID="DIDAuthScreen">
      {authState === 'processing' ? <Spinner /> : null}
      <Typography variant="description" marginLeft={2}>
        {translate(`qr_scanner.${authState}`)}
      </Typography>
    </ScreenContainer>
  );
}
export function DIDAuthScreenContainer({route}) {
  const {dockWalletAuthDeepLink} = route.params || {};
  const isScreenFocus = useIsFocused();
  const [authState, setAuthState] = useState('start');

  const authenticateDid = useCallback(async () => {
    setAuthState('processing');
    await authHandler(dockWalletAuthDeepLink);
    setAuthState('completed');
    setTimeout(() => {
      navigate(Routes.ACCOUNTS);
    }, 2000);
  }, [dockWalletAuthDeepLink]);

  useEffect(() => {
    if (dockWalletAuthDeepLink && isScreenFocus) {
      authenticateDid();
    }
  }, [authenticateDid, dockWalletAuthDeepLink, isScreenFocus]);
  return <DIDAuthScreen authState={authState} />;
}
