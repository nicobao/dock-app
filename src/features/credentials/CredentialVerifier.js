import {ScrollView, Stack} from 'native-base';
import React from 'react';
import {addTestId} from 'src/core/automation-utils';
import {withErrorBoundary} from 'src/core/error-handler';
import {navigate} from 'src/core/navigation';
import {Routes} from 'src/core/routes';
import {translate} from 'src/locales';
import {
  BigButton,
  Box,
  Header,
  ScreenContainer,
  Typography,
  MenuScanQRIcon,
  LinkIcon,
  UploadIcon,
  Theme,
} from '../../design-system';

const SCAN_OPTIONS = {
  QR_CODE: 'qrCode',
  JSON_FILE: 'jsonFile',
  URL: 'url',
};

export const CredentialVerifier = withErrorBoundary(({handleScan}) => {
  return (
    <ScreenContainer testID={'CredentialVerifier'} showTabNavigation>
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {/* {translate('account_list.title')} */}
              Verify a credential
            </Typography>
            <Typography marginTop={12}>
              Verify any verifiable credentials (VCs) via a URL, JSON file or
              scanning a QR code
            </Typography>
          </Box>
        </Box>
      </Header>
      <ScrollView>
        <Stack mx={26} flex={1} mt={0}>
          <BigButton
            {...addTestId('CreateNewAccount')}
            onPress={handleScan(SCAN_OPTIONS.QR_CODE)}
            icon={<MenuScanQRIcon color={Theme.icons.color} />}>
            {translate('credentialVerifier.verifyViaQRCode')}
          </BigButton>
          <BigButton
            {...addTestId('CreateNewAccount')}
            onPress={handleScan(SCAN_OPTIONS.URL)}
            icon={<LinkIcon />}>
            {translate('credentialVerifier.verifyViaURL')}
          </BigButton>
          <BigButton
            {...addTestId('CreateNewAccount')}
            onPress={handleScan(SCAN_OPTIONS.JSON_FILE)}
            icon={<UploadIcon />}>
            {translate('credentialVerifier.verifyViaJSON')}
          </BigButton>
        </Stack>
      </ScrollView>
    </ScreenContainer>
  );
});

export const CredentialVerifierContainer = withErrorBoundary(({navigation}) => {
  const handleScan = option => () => {
    if (option === SCAN_OPTIONS.QR_CODE) {
      navigate(Routes.APP_QR_SCANNER);
    } else if (option === SCAN_OPTIONS.JSON_FILE) {
      navigate(Routes.APP_QR_SCANNER);
    } else if (option === SCAN_OPTIONS.URL) {
      navigate(Routes.APP_QR_SCANNER);
    }
  };

  return <CredentialVerifier handleScan={handleScan} />;
});
