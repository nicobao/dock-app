import React, {useEffect, useState} from 'react';
import {
  Header,
  // Button,
  Footer,
  Content,
  Text,
  ScreenContainer,
  Typography,
  Box,
  NBox,
  BigButton,
  DotsVerticalIcon,
  CheckCircleIcon,
  IconButton,
  AlertIcon,
  BackButton,
  LoadingScreen,
} from '../../design-system';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import CogIcon from '../../assets/icons/cog.svg';
import {
  Avatar,
  Button,
  ChevronLeftIcon,
  Divider,
  Menu,
  Pressable,
  Stack,
  useToast,
} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';
import {showToast} from '../../core/toast';
import {useDispatch, useSelector} from 'react-redux';
import {accountOperations, accountSelectors} from './account-slice';
import {navigate, navigateBack} from '../../core/navigation';
import {AccountSettingsModal} from './AccountSettingsModal';
import {Routes} from '../../core/routes';
import {QRCodeModal} from './QRCodeModal';
import Identicon from '@polkadot/reactnative-identicon';

export function AccountDetailsScreen({
  account,
  onSend,
  onReceive,
  onDelete,
  onBackup,
  onEdit,
  onExport,
  qrCodeData,
}) {
  const [accountSettingsVisible, setAccountSettingsVisible] = useState();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState();

  useEffect(() => {
    if (!!qrCodeData) {
      setQrCodeModalVisible(true);
    }
  }, [qrCodeData]);

  return (
    <ScreenContainer testID="AccountDetailsScreen">
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography
              fontFamily="Montserrat"
              fontSize={17}
              fontWeight="600"
              color="#fff">
              {account.meta.name}
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end">
            <Pressable onPress={() => setAccountSettingsVisible(true)}>
              <DotsVerticalIcon width="22px" height="22px" />
            </Pressable>
          </NBox>
        </Box>
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Stack
          direction="column"
          alignItems="center"
          backgroundColor="#27272A"
          p="32px"
          borderRadius={8}>
          <Identicon value={account.id} size={48} />
          <Text
            color="#fff"
            fontSize="32px"
            fontWeight={600}
            fontFamily="Montserrat"
            mt={3}>
            {account.meta.balance.value} {account.meta.balance.symbol}
          </Text>
          <Text
            color="#D4D4D8"
            fontSize={14}
            fontWeight={500}
            fontFamily="Montserrat">
            0.00 USD
          </Text>
          <Stack direction="row" width="100%" mt={5}>
            <Button flex={1} size="sm">
              Send
            </Button>
            <Button ml={2} flex={1} size="sm">
              Receive
            </Button>
          </Stack>
        </Stack>

        <Stack mt={8}>
          <NBox borderBottomColor="#ccc" borderBottomWidth={0.5} pb={4}>
            <Typography
              fontFamily="Montserrat"
              fontSize={20}
              fontWeight="600"
              color="#fff">
              Transactions
            </Typography>
          </NBox>
          <NBox mt={8}>
            <Typography fontSize={16} fontWeight="400" color="#A1A1AA">
              Your transactions will appear here
            </Typography>
          </NBox>
        </Stack>

        {account.meta.hasBackup ? null : (
          <Stack backgroundColor="rgba(120, 53, 15, 0.3)" p={'16px'} mt={20}>
            <Stack direction="row">
              <NBox mr={3} mt={'3px'}>
                <AlertIcon />
              </NBox>
              <Typography
                ml={2}
                fontFamily="Montserrat"
                fontSize={16}
                fontWeight="600"
                color="#fff">
                Account not backed up
              </Typography>
            </Stack>
            <NBox mt={2}>
              <Typography color="background: rgba(254, 243, 199, 1)">
                This phrase allows you to recover your account if your phone is
                lost or you change your device.
              </Typography>
            </NBox>
            <Button
              onPress={onBackup}
              mt={4}
              alignSelf="flex-start"
              size="sm"
              backgroundColor="rgba(120, 53, 15, 1)">
              Back up now
            </Button>
          </Stack>
        )}
      </Content>
      <AccountSettingsModal
        visible={accountSettingsVisible}
        onClose={() => setAccountSettingsVisible(false)}
        onDelete={onDelete}
        onExport={onExport}
      />
      <QRCodeModal
        data={qrCodeData}
        title="Export account"
        description="Scan this QR code in your new device"
        visible={qrCodeModalVisible}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </ScreenContainer>
  );
}

export function AccountDetailsContainer({route}) {
  const {id: accountId, qrCodeData} = route.params;
  const dispatch = useDispatch();
  const account = useSelector(accountSelectors.getAccountById(accountId));

  if (!account) {
    return <LoadingScreen />;
  }

  return (
    <AccountDetailsScreen
      onDelete={() => {
        return dispatch(accountOperations.removeAccount(accountId)).then(
          navigateBack,
        );
      }}
      onEdit={() => {
        alert('edit');
      }}
      onBackup={() => {
        return dispatch(accountOperations.backupAccount(account));
      }}
      qrCodeData={qrCodeData}
      account={account}
      onExport={method => {
        navigate(Routes.ACCOUNT_EXPORT_SETUP_PASSWORD, {
          method,
          accountId,
        });
      }}
    />
  );
}

// [
//   {
//     id: 1,
//     name: 'cocomelon',
//     balance: {
//       value: 0,
//       symbol: 'DOCK',
//     },
//   },
// ]
