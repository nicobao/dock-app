import {Box, Stack} from 'native-base';
import React, {useCallback} from 'react';
import {Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {PolkadotIcon} from 'src/components/PolkadotIcon';
import {addTestId} from 'src/core/automation-utils';
import {Ionicons} from '@native-base/icons';
import {Icon} from 'native-base';
import {
  BackButton,
  Button,
  Content,
  Header,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import Clipboard from '@react-native-community/clipboard';
import {showToast} from '../../core/toast';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';

export function ShareDIDScreen({did, didName, accountIcon, onCopyAddress}) {
  const qrSize = Dimensions.get('window').width * 0.5;

  return (
    <ScreenContainer {...addTestId('ShareDIDScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <Stack alignItems="center">
        <Typography variant="h1" mb={2}>
          {translate('didManagement.share_did')}
        </Typography>
        <Typography variant="screen-description">
          {translate('didManagement.share_did_desc')}
        </Typography>
      </Stack>
      <Content marginLeft={26} marginRight={26}>
        <Stack
          bg={Theme.colors.secondaryBackground}
          p={5}
          alignItems="center"
          borderRadius={12}
          my={7}>
          <Stack p={2} bg={Theme.colors.qrCodeBackground}>
            <QRCode value={did} size={qrSize} />
          </Stack>
          <Stack direction="row" alignItems="center" flex={1} pt={5}>
            <Box pr={2}>{accountIcon}</Box>
            <Stack direction="column" alignItems="flex-start" flex={1}>
              <Typography variant="h3">{didName}</Typography>
              <Typography>{did}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Content>
      <NBox mb={7} mx={7}>
        <Button
          startIcon={<Icon as={Ionicons} name="copy-outline" size="sm" />}
          size="sm"
          onPress={onCopyAddress}>
          {translate('didManagement.copy_did')}
        </Button>
      </NBox>
    </ScreenContainer>
  );
}

export function ShareDIDScreenContainer({route}) {
  const {did, didName} = route.params || {};

  const handleCopyAddress = useCallback(() => {
    Clipboard.setString(did);
    showToast({
      message: translate('didManagement.did_copied'),
    });
    logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_SHARED, {
      did,
    });
  }, [did]);

  return (
    <ShareDIDScreen
      onCopyAddress={handleCopyAddress}
      did={did}
      didName={didName}
      accountIcon={<PolkadotIcon address={did} size={32} />}
    />
  );
}
