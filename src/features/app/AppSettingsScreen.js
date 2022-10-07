import React from 'react';
import {
  Header,
  Content,
  ScreenContainer,
  Typography,
  Box,
  OptionList,
  DownloadIcon,
  TrashIcon,
  ChevronRightIcon,
  Theme,
} from '../../design-system';
import {useDispatch, useSelector} from 'react-redux';
import {AppConstants} from './constants';
import {walletOperations} from '../wallet/wallet-slice';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {translate} from 'src/locales';
import {BuildIdentifier} from './BuildIdentifier';
import {Stack} from 'native-base';
import {appActions, appSelectors} from './app-slice';

const constants = AppConstants.settings;

export function AppSettingsScreen({
  onDeleteWallet,
  onBackupWallet,
  onDevSettings,
  dispatch,
  devSettingsEnabled,
}) {
  return (
    <ScreenContainer testID="AccountDetailsScreen" showTabNavigation>
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('settings.title')}
            </Typography>
          </Box>
          <Box row />
        </Box>
      </Header>

      <Content>
        <Stack flex={1}>
          <OptionList
            mx={5}
            items={[
              {
                testID: constants.testID.backupWalletOption,
                title: translate('settings.backup_wallet'),
                icon: (
                  <DownloadIcon
                    style={{
                      color: Theme.colors.secondaryIconColor,
                    }}
                  />
                ),
                onPress: onBackupWallet,
              },
              {
                testID: constants.testID.deleteWalletOption,
                title: translate('settings.delete_wallet'),
                icon: (
                  <TrashIcon
                    style={{
                      color: Theme.colors.secondaryIconColor,
                    }}
                  />
                ),
                onPress: onDeleteWallet,
              },
              devSettingsEnabled
                ? {
                    testID: constants.testID.devSettings,
                    title: translate('settings.dev_settings'),
                    icon: (
                      <ChevronRightIcon
                        style={{
                          color: Theme.colors.secondaryIconColor,
                        }}
                      />
                    ),
                    onPress: onDevSettings,
                  }
                : false,
            ].filter(item => !!item)}
          />
        </Stack>
        <Stack p={5}>
          <BuildIdentifier
            onUnlock={() => {
              dispatch(appActions.setDevSettingsEnabled(true));
            }}
          />
        </Stack>
      </Content>
    </ScreenContainer>
  );
}

export function AppSettingsContainer() {
  const dispatch = useDispatch();
  const devSettingsEnabled = useSelector(appSelectors.getDevSettingsEnabled);

  return (
    <AppSettingsScreen
      devSettingsEnabled={devSettingsEnabled}
      dispatch={dispatch}
      onDeleteWallet={() => {
        return dispatch(walletOperations.confirmWalletDelete());
      }}
      onBackupWallet={() => {
        navigate(Routes.WALLET_EXPORT_BACKUP);
      }}
      onDevSettings={() => {
        navigate(Routes.DEV_SETTINGS);
      }}
    />
  );
}
