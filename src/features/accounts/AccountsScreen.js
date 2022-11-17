import {Menu, Pressable, ScrollView, Stack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, RefreshControl} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {useDispatch} from 'react-redux';
import {addTestId} from 'src/core/automation-utils';
import {withErrorBoundary} from 'src/core/error-handler';
import {formatCurrency} from 'src/core/format-utils';
import {navigate} from 'src/core/navigation';
import {Routes} from 'src/core/routes';
import {translate} from 'src/locales';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {useWallet, useAccount} from '@docknetwork/wallet-sdk-react-native/lib';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {
  AlertIcon,
  BigButton,
  Box,
  Button,
  ChevronRightIcon,
  DotsVerticalIcon,
  Footer,
  Header,
  IconButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {createAccountOperations} from '../account-creation/create-account-slice';
import {TokenAmount} from '../tokens/ConfirmTransactionModal';
import {accountOperations} from './account-slice';
import {AddAccountModal} from './AddAccountModal';
import {AccountsScreenTestIDs} from './test-ids';
import {pickDocument, readFile} from '../../core/storage-utils';
import assert from 'assert';
import {useAccountsList} from './accountsHooks';

const AccountCard = withErrorBoundary(
  ({document, onDetails, onDelete, index}) => {
    assert(document.type === 'Address', 'Address document expected');
    const {address} = document;
    const {account, fetchBalance} = useAccount(address);

    useEffect(() => {
      fetchBalance(address);
    }, [address, fetchBalance]);

    if (!account) {
      return null;
    }

    return (
      <Stack
        key={account.address}
        direction="row"
        borderRadius={12}
        backgroundColor={Theme.colors.cardItemBackground}
        space={2}
        mb={4}
        py={6}
        px={6}>
        <Stack direction="column" flex={1}>
          <Stack direction="row" alignItems="center">
            <Pressable
              _pressed={{
                opacity: Theme.touchOpacity,
              }}
              onPress={() => onDetails(account)}
              flex={1}>
              <Stack direction="row" flex={1} alignItems="center">
                <PolkadotIcon address={account.address} size={32} />
                <Stack direction="row" flex={1} ml={3}>
                  <Typography
                    color={Theme.colors.textHighlighted}
                    fontWeight={600}>
                    {account.name}
                  </Typography>
                  <ChevronRightIcon
                    style={{
                      color: Theme.colors.primaryIconColor,
                    }}
                    marginTop={3}
                  />
                </Stack>
              </Stack>
            </Pressable>
            <NBox py={1} px={1}>
              <Stack direction="row">
                {displayWarning(account) ? (
                  <NBox mr={3} mt={1}>
                    <AlertIcon />
                  </NBox>
                ) : null}
                <Menu
                  bg={Theme.colors.tertiaryBackground}
                  {...addTestId(`account-item-menu-${index}`)}
                  trigger={triggerProps => {
                    return (
                      <Pressable
                        {...triggerProps}
                        _pressed={{
                          opacity: Theme.touchOpacity,
                        }}>
                        <DotsVerticalIcon />
                      </Pressable>
                    );
                  }}>
                  <Menu.Item
                    {...addTestId('account-item-menu-details')}
                    onPress={() => onDetails(account)}>
                    {translate('account_list.account_details')}
                  </Menu.Item>
                  <Menu.Item
                    {...addTestId('account-item-menu-delete')}
                    onPress={() => onDelete(account)}>
                    {translate('account_list.delete_account')}
                  </Menu.Item>
                </Menu>
              </Stack>
            </NBox>
          </Stack>

          <TokenAmount amount={account.balance}>
            {({fiatAmount, fiatSymbol, tokenAmount, tokenSymbol}) => (
              <>
                <Stack direction="column" mt={4}>
                  <Typography variant="h2">
                    {tokenAmount} {tokenSymbol}
                  </Typography>
                  <Typography fontSize="14px">
                    {formatCurrency(fiatAmount)}
                  </Typography>
                </Stack>
              </>
            )}
          </TokenAmount>

          <Stack direction="row" mt={4}>
            {
              <Button
                width="50%"
                size="xs"
                disabled={account.readOnly}
                variant={'whiteButton'}
                colorScheme="dark"
                {...addTestId('TokenSend')}
                onPress={() => {
                  navigate(Routes.TOKEN_SEND, {
                    address: account.address,
                  });
                }}>
                <Typography color={Theme.colors.primaryBackground}>
                  {translate('account_list.send_token')}
                </Typography>
              </Button>
            }
            <Button
              width="50%"
              size="xs"
              ml={2}
              variant={'whiteButton'}
              colorScheme="dark"
              {...addTestId('TokenReceive')}
              onPress={() => {
                navigate(Routes.TOKEN_RECEIVE, {
                  address: account.address,
                });
              }}>
              <Typography color={Theme.colors.primaryBackground}>
                {translate('account_list.receive_token')}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  },
);

export function displayWarning(account) {
  return !!(
    (account.mnemonic && !account.hasBackup) ||
    (account.meta && account.meta.keypairNotFoundWarning)
  );
}

export const AccountsScreen = withErrorBoundary(
  ({
    status,
    migrated,
    accounts = [],
    onAddAccount,
    onImportExistingAccount,
    onDelete,
    onDetails,
    onRefresh,
    isRefreshing,
  }) => {
    const isEmpty = accounts.length === 0;
    const [showAddAccount, setShowAddAccount] = useState();
    const [showImportAccount, setShowImportAccount] = useState();

    return (
      <ScreenContainer testID={AccountsScreenTestIDs.screen} showTabNavigation>
        <Header>
          <Box
            marginLeft={22}
            marginRight={22}
            flexDirection="row"
            alignItems="center">
            <Box flex={1}>
              <Typography
                fontFamily="Montserrat"
                fontSize={24}
                fontWeight="600">
                {translate('account_list.title')}
              </Typography>
            </Box>
            <Box row>
              <IconButton
                col
                {...addTestId(AccountsScreenTestIDs.addAccountMenuBtn)}
                onPress={() => setShowAddAccount(true)}>
                <PlusCircleWhiteIcon
                  style={{
                    color: Theme.colors.headerIconColor,
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Header>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          <Stack mx={26} flex={1}>
            {isEmpty ? (
              <Box flex={1} justifyContent="center" alignItems="center">
                <Typography variant={'h3'} marginTop={12}>
                  {translate('account_list.empty_accounts')}
                </Typography>
              </Box>
            ) : (
              <NBox>
                {accounts.map((account, index) => {
                  return (
                    <AccountCard
                      index={index}
                      key={account.id}
                      document={account}
                      onDetails={onDetails}
                      onDelete={onDelete}
                    />
                  );
                })}
              </NBox>
            )}
          </Stack>
        </ScrollView>
        {isEmpty ? (
          <Footer marginBottom={114} marginLeft={26} marginRight={26} flex={1}>
            <BigButton
              {...addTestId('CreateNewAccount')}
              onPress={onAddAccount}
              icon={
                <PlusCircleIcon
                  style={{
                    color: Theme.colors.textHighlighted,
                  }}
                />
              }>
              Create new account
            </BigButton>
            <BigButton
              {...addTestId('ImportExistingBtn')}
              onPress={() => {
                setShowImportAccount(true);
                setShowAddAccount(true);
              }}
              icon={
                <DocumentDownloadIcon
                  style={{
                    color: Theme.colors.textHighlighted,
                  }}
                />
              }>
              {translate('add_account_modal.import_existing')}
            </BigButton>
          </Footer>
        ) : null}
        <AddAccountModal
          visible={showAddAccount}
          showImportAccount={showImportAccount}
          onClose={() => {
            setShowImportAccount(false);
            setShowAddAccount(false);
          }}
          onAddAccount={onAddAccount}
          onImportExistingAccount={onImportExistingAccount}
        />
      </ScreenContainer>
    );
  },
);

export const AccountsContainer = withErrorBoundary(({navigation}) => {
  const dispatch = useDispatch();
  const {refetch, status, migrated} = useWallet({syncDocs: true});

  const {accounts} = useAccountsList();
  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  useEffect(() => {
    dispatch(accountOperations.loadAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      navigation.addListener('beforeRemove', e => {
        RNExitApp.exitApp();
        e.preventDefault();
      });
    }
  }, [navigation]);

  return (
    <AccountsScreen
      status={status}
      migrated={migrated}
      onDelete={accountId => {
        dispatch(accountOperations.removeAccount(accountId));
      }}
      onDetails={account => {
        navigate(Routes.ACCOUNT_DETAILS, {
          id: account.address,
        });
      }}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      accounts={accounts}
      onAddAccount={() => {
        dispatch(accountOperations.addAccountFlow());
      }}
      onImportExistingAccount={async method => {
        if (method === 'mnemonic') {
          navigate(Routes.ACCOUNT_IMPORT_FROM_MNEMONIC);
        } else if (method === 'qrcode') {
          navigate(Routes.APP_QR_SCANNER, {
            onData: data => {
              dispatch(createAccountOperations.importFromJson(data));
            },
          });
        } else if (method === 'json') {
          const file = await pickDocument();

          if (!file) {
            return;
          }

          const fileData = await readFile(file.fileCopyUri);

          dispatch(createAccountOperations.importFromJson(fileData));
        }
        logAnalyticsEvent(ANALYTICS_EVENT.ACCOUNT.IMPORT, {
          method,
        });
      }}
    />
  );
});
