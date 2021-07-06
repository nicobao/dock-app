import React, {useEffect, useState} from 'react';
import {
  Header,
  Footer,
  Content,
  Text,
  ScreenContainer,
  Typography,
  Box,
  NBox,
  BigButton,
  DotsVerticalIcon,
  IconButton,
  AlertIcon,
} from '../../design-system';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import CogIcon from '../../assets/icons/cog.svg';
import {
  Avatar,
  Menu,
  Pressable,
  Stack,
  useToast,
} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {accountOperations, accountSelectors} from './account-slice';
import {navigate} from 'src/core/navigation';
import {Routes} from 'src/core/routes';
import {AddAccountModal} from './AddAccountModal';
import {ImportExistingAccountModal} from './ImportExistingAccountModal';
import { createAccountOperations } from '../account-creation/create-account-slice';

export function AccountsScreen({
  accounts = [],
  onAddAccount,
  onImportExistingAccount,
  onDelete,
  onEdit,
  onDetails,
}) {
  const isEmpty = accounts.length === 0;
  const [showAddAccount, setShowAddAccount] = useState();
  const [showImportAccount, setShowImportAccount] = useState();

  return (
    <ScreenContainer testID="accounts-screen">
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              Accounts
            </Typography>
          </Box>
          <Box row>
            <IconButton col marginRight={10} onPress={() => setShowAddAccount(true)}>
              <PlusCircleWhiteIcon />
            </IconButton>
            <IconButton col onPress={() => alert('Available soon!')}>
              <CogIcon />
            </IconButton>
          </Box>
        </Box>
      </Header>
      <Content marginLeft={26} marginRight={26}>
        {isEmpty ? (
          <Box flex justifyContent="center" alignItems="center">
            <Typography
              fontSize={16}
              lineHeight={24}
              fontWeight="400"
              marginTop={12}>
              You don’t have any accounts yet.
            </Typography>
          </Box>
        ) : (
          <NBox>
            {accounts.map(account => {
              return (
                <Stack
                  direction="row"
                  borderRadius={12}
                  backgroundColor="#27272A"
                  space={2}
                  mb={4}
                  py={6}
                  px={4}>
                  <Avatar width="48px" height="48px" bgColor="white"></Avatar>
                  <Stack direction="column" flex={1}>
                    <Text color="#fff" fontWeight={600}>
                      {account.meta.name}
                    </Text>
                    <Text color="#D4D4D8">
                      {account.meta.balance.value} {account.meta.balance.symbol}
                    </Text>
                  </Stack>
                  <NBox py={1} px={1}>
                    <Stack direction="row">
                      {account.meta.hasBackup ? null : (
                        <NBox mr={3} mt={1}>
                          <AlertIcon />
                        </NBox>
                      )}
                      <Menu
                        trigger={triggerProps => {
                          return (
                            <Pressable {...triggerProps}>
                              <DotsVerticalIcon />
                            </Pressable>
                          );
                        }}>
                        <Menu.Item onPress={() => onDelete(account)}>
                          Delete
                        </Menu.Item>
                        <Menu.Item onPress={() => onDetails(account)}>
                          Details
                        </Menu.Item>
                      </Menu>
                    </Stack>
                  </NBox>
                </Stack>
              );
            })}
          </NBox>
        )}
      </Content>
      {isEmpty ? (
        <Footer marginBottom={114} marginLeft={26} marginRight={26} flex>
          <BigButton onPress={onAddAccount} icon={<PlusCircleIcon />}>
            Create new account
          </BigButton>
          <BigButton
            onPress={() => alert('Available soon')}
            icon={<DocumentDownloadIcon />}>
            Import existing account
          </BigButton>
        </Footer>
      ) : null}
      <AddAccountModal
        visible={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        onAddAccount={onAddAccount}
        onImportExistingAccount={onImportExistingAccount}
      />
    </ScreenContainer>
  );
}

export function AccountsContainer() {
  const dispatch = useDispatch();
  const accounts = useSelector(accountSelectors.getAccounts);
  useEffect(() => {
    dispatch(accountOperations.loadAccounts());
  }, []);

  return (
    <AccountsScreen
      onDelete={accountId => {
        dispatch(accountOperations.removeAccount(accountId));
      }}
      onDetails={account => {
        navigate(Routes.ACCOUNT_DETAILS, {
          id: account.id,
        });
      }}
      accounts={accounts}
      onAddAccount={() => {
        dispatch(accountOperations.addAccountFlow());
      }}
      onImportExistingAccount={(method) => {
        if (method === 'mnemonic') {
          navigate(Routes.ACCOUNT_IMPORT_FROM_MNEMONIC);
        } else if (method === 'qrcode') {
          navigate(Routes.APP_QR_SCANNER, {
            onData: (data) => {
              dispatch(createAccountOperations.importFromJson(data));
            }
          })
        }
      }}
    />
  );
}
