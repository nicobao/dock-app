import {authHandler} from '../qr-code-scanner/qr-code';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Header,
  NBox,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {Button, Spinner, Stack} from 'native-base';
import {translate} from '../../locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {useWallet} from '@docknetwork/wallet-sdk-react-native/lib';

export function DIDAuthScreen({authState, retry}) {
  return (
    <ScreenContainer testID="DIDAuthScreen">
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('qr_scanner.header')}
            </Typography>
          </Box>
        </Box>
      </Header>
      <Stack direction={'column'} mx={70} mt={40}>
        <NBox mt={15}>
          {authState === 'processing' ? <Spinner /> : null}

          <Typography
            style={{
              textAlign: 'center',
            }}
            variant="list-description">
            {translate(`qr_scanner.${authState}`)}
          </Typography>
        </NBox>
        {authState === 'error' ? (
          <Button onPress={retry} mt={7}>
            <Typography>{translate('qr_scanner.retry')}</Typography>
          </Button>
        ) : null}
      </Stack>
    </ScreenContainer>
  );
}
export function DIDAuthScreenContainer({route}) {
  const {dockWalletAuthDeepLink} = route.params || {};
  const isScreenFocus = useIsFocused();
  const {status} = useWallet({syncDocs: true});
  const [authState, setAuthState] = useState('start');

  const authenticateDID = useCallback(async () => {
    setAuthState('processing');
    const result = await authHandler(dockWalletAuthDeepLink);
    if (result) {
      setAuthState('completed');
      setTimeout(() => {
        navigate(Routes.ACCOUNTS);
      }, 3000);
    } else {
      setAuthState('error');
    }
  }, [dockWalletAuthDeepLink]);

  useEffect(() => {
    if (dockWalletAuthDeepLink && isScreenFocus && status === 'ready') {
      authenticateDID();
    }
  }, [authenticateDID, dockWalletAuthDeepLink, isScreenFocus, status]);
  return <DIDAuthScreen authState={authState} retry={authenticateDID} />;
}
