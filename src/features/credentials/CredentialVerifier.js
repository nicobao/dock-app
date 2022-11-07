import {ScrollView, Stack, Box} from 'native-base';
import React from 'react';
import {addTestId} from 'src/core/automation-utils';
import {withErrorBoundary} from 'src/core/error-handler';
import {navigate} from 'src/core/navigation';
import {Routes} from 'src/core/routes';
import {translate} from 'src/locales';
import {
  BigButton,
  Header,
  ScreenContainer,
  Typography,
  MenuScanQRIcon,
  LinkIcon,
  UploadIcon,
  Theme,
  BackButton,
} from '../../design-system';

const SCAN_OPTIONS = {
  QR_CODE: 'qrCode',
  JSON_FILE: 'jsonFile',
  URL: 'url',
};

export const CredentialVerifier = withErrorBoundary(({handleVerify}) => {
  return (
    <ScreenContainer testID={'CredentialVerifier'} showTabNavigation>
      <Header>
        <Box ml={0}>
          <BackButton onPress={() => navigate(Routes.APP_SETTINGS)} />
        </Box>
        <Box mx={22} my={30} flexDirection="row" alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('credentialVerifier.title')}
            </Typography>
            <Typography marginTop={8}>
              {translate('credentialVerifier.description')}
            </Typography>
          </Box>
        </Box>
      </Header>
      <ScrollView>
        <Stack mx={26} flex={1} mt={0}>
          <BigButton
            {...addTestId('CreateNewAccount')}
            onPress={handleVerify(SCAN_OPTIONS.QR_CODE)}
            icon={<MenuScanQRIcon color={Theme.icons.color} />}>
            {translate('credentialVerifier.verifyViaQRCode')}
          </BigButton>
          <BigButton
            {...addTestId('CreateNewAccount')}
            onPress={handleVerify(SCAN_OPTIONS.URL)}
            icon={<LinkIcon />}>
            {translate('credentialVerifier.verifyViaURL')}
          </BigButton>
          <BigButton
            {...addTestId('CreateNewAccount')}
            onPress={handleVerify(SCAN_OPTIONS.JSON_FILE)}
            icon={<UploadIcon />}>
            {translate('credentialVerifier.verifyViaJSON')}
          </BigButton>
        </Stack>
      </ScrollView>
    </ScreenContainer>
  );
});

export const CredentialVerifierContainer = withErrorBoundary(({navigation}) => {
  const handleVerify = option => () => {
    if (option === SCAN_OPTIONS.QR_CODE) {
      navigate(Routes.APP_QR_SCANNER);
    } else if (option === SCAN_OPTIONS.JSON_FILE) {
      navigate(Routes.APP_QR_SCANNER);
    } else if (option === SCAN_OPTIONS.URL) {
      navigate(Routes.APP_QR_SCANNER);
    }
  };

  return <CredentialVerifier handleVerify={handleVerify} />;
});
