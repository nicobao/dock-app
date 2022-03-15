import {Button, Pressable, ScrollView, Stack} from 'native-base';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {formatCurrency} from 'src/core/format-utils';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {navigate, navigateBack} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {
  AlertIcon,
  RetryIcon,
  BackButton,
  Box,
  DotsVerticalIcon,
  Header,
  LoadingScreen,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {TokenAmount} from '../tokens/ConfirmTransactionModal';
import {TransactionConfirmationModal} from '../transactions/TransactionConfirmationModal';
import {TransactionDetailsModal} from '../transactions/TransactionDetailsModal';
import {
  transactionsOperations,
  transactionsSelectors,
  TransactionStatus,
} from '../transactions/transactions-slice';
import {accountOperations, accountSelectors} from './account-slice';
import {AccountSettingsModal} from './AccountSettingsModal';
import {QRCodeModal} from './QRCodeModal';
import {addTestId} from '../../core/automation-utils';
import {appSelectors} from '../app/app-slice';

const TransactionStatusColor = {
  pending: Theme.colors.transactionPending,
  failed: Theme.colors.transactionFailed,
  complete: Theme.colors.transactionCompleted,
};

const TRANSACTION_FILTERS = {
  sent: 'sent',
  received: 'received',
  failed: 'failed',
};

function TransactionHistoryItem({transaction, accountAddress}) {
  const [showDetails, setShowDetails] = useState();
  const [showConfirmation, setShowConfirmation] = useState();

  const {amount, sent} = transaction;

  const transactionAmountVariant = useMemo(() => {
    if (sent) {
      return 'transaction-filter-amount-sent';
    } else if (transaction.status === TransactionStatus.Complete) {
      return 'transaction-filter-amount-received';
    }
    return 'transaction-filter-amount-failed';
  }, [sent, transaction.status]);

  return (
    <>
      <TransactionConfirmationModal
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        transaction={transaction}
      />
      <TransactionDetailsModal
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        transaction={transaction}
        accountAddress={accountAddress}
      />

      <TouchableHighlight
        onPress={() => {
          setShowDetails(true);
        }}>
        <Stack direction={'row'} py={2}>
          <Stack direction={'column'} flex={1}>
            <Typography variant="h3">
              {translate(`transaction_details.${sent ? 'sent' : 'received'}`)}{' '}
            </Typography>
            <Stack direction="row">
              <Stack
                direction="row"
                bg={Theme.colors.secondaryBackground}
                borderRadius={Theme.borderRadius * 2}
                px={3}
                w="auto">
                <Stack
                  bg={TransactionStatusColor[transaction.status]}
                  w={2}
                  h={2}
                  borderRadius={10}
                  mt={2}
                  mr={2}
                />
                <Typography>
                  {translate(
                    `transaction_status.${transaction.status || 'pending'}`,
                  )}
                </Typography>
              </Stack>
              <Stack flex={1} />
            </Stack>
            {transaction.status === TransactionStatus.Failed &&
            !transaction.retrySucceed ? (
              <Stack alignItems="flex-start">
                <Button
                  startIcon={<RetryIcon />}
                  variant={'transactionRetry'}
                  size="xs"
                  onPress={() => setShowConfirmation(true)}>
                  {translate('transaction_history.try_again')}
                </Button>
              </Stack>
            ) : null}
          </Stack>
          <Stack direction={'column'}>
            <TokenAmount amount={amount}>
              {({tokenAmount, tokenSymbol, fiatAmount, fiatSymbol}) => (
                <>
                  <Typography variant={transactionAmountVariant}>
                    {sent ? '-' : ''}
                    {tokenAmount} {tokenSymbol}
                  </Typography>
                  <Typography variant={'fiat-amount'}>
                    {formatCurrency(fiatAmount)} {fiatSymbol}
                  </Typography>
                </>
              )}
            </TokenAmount>
          </Stack>
        </Stack>
      </TouchableHighlight>
    </>
  );
}

export function filterTransactionHistory(
  transactions,
  accountAddress,
  filter = 'all',
) {
  return transactions
    .map(item => ({
      ...item,
      sent: item.fromAddress === accountAddress,
    }))
    .filter(item => {
      const receivedFailed =
        !item.sent && item.status === TransactionStatus.Failed;
      return !receivedFailed;
    })
    .filter(item => {
      if (filter === 'all') {
        return true;
      }
      if (filter === TRANSACTION_FILTERS.sent) {
        return !!item.sent;
      }
      if (filter === TRANSACTION_FILTERS.received) {
        return !item.sent;
      }
      if (filter === TRANSACTION_FILTERS.failed) {
        return item.status === TransactionStatus.Failed;
      }
      return true;
    });
}

function TransactionHistory({accountAddress}) {
  const groupedTransactions = useSelector(
    transactionsSelectors.getGroupedTransactions,
  );

  const networkId = useSelector(appSelectors.getNetworkId);
  const showTestnetConfig = useSelector(
    appSelectors.getShowTestnetTransactionConfig,
  );
  const [activeFilter, setActiveFilter] = useState('all');

  const _renderTransactions = useCallback(() => {
    let transJsx = <></>;

    const {Today, Yesterday, ...rest} = groupedTransactions;

    const todayTransactions = Array.isArray(Today)
      ? filterTransactionHistory(Today, accountAddress, activeFilter)
      : [];

    const yesterdayTransactions = Array.isArray(Yesterday)
      ? filterTransactionHistory(Yesterday, accountAddress, activeFilter)
      : [];

    if (todayTransactions.length > 0) {
      transJsx = (
        <>
          {transJsx}
          <Typography variant="h3">
            {translate('transaction_history.today')}
          </Typography>
          {todayTransactions.map(item => {
            return (
              <TransactionHistoryItem
                key={item.id}
                transaction={item}
                accountAddress={accountAddress}
              />
            );
          })}
          <NBox
            borderBottomColor={Theme.colors.tertiaryBackground}
            borderBottomWidth={0.5}
            mt={3}
            mb={3}
          />
        </>
      );
    }
    if (yesterdayTransactions.length > 0) {
      transJsx = (
        <>
          {transJsx}
          <Typography variant="h3">
            {translate('transaction_history.yesterday')}
          </Typography>
          {yesterdayTransactions.map(item => {
            return (
              <TransactionHistoryItem
                key={item.id}
                transaction={item}
                accountAddress={accountAddress}
              />
            );
          })}
          <NBox
            borderBottomColor={Theme.colors.tertiaryBackground}
            borderBottomWidth={0.5}
            mt={3}
            mb={3}
          />
        </>
      );
    }

    for (const key in rest) {
      const transactions = filterTransactionHistory(
        groupedTransactions[key],
        accountAddress,
        activeFilter,
      );
      if (transactions.length > 0) {
        transJsx = (
          <>
            {transJsx}
            <Typography variant="h3">{key}</Typography>
            {transactions.map(item => {
              return (
                <TransactionHistoryItem
                  key={item.id}
                  transaction={item}
                  accountAddress={accountAddress}
                />
              );
            })}
            <NBox
              borderBottomColor={Theme.colors.tertiaryBackground}
              borderBottomWidth={0.5}
              mt={3}
              mb={3}
            />
          </>
        );
      }
    }
    return transJsx;
  }, [groupedTransactions, accountAddress, activeFilter]);

  if (networkId !== 'mainnet' && !showTestnetConfig) {
    return (
      <NBox>
        <Typography variant="list-description">
          {translate('account_details.no_transactions_on_testnet', {
            networkId,
          })}
        </Typography>
      </NBox>
    );
  }
  if (Object.keys(groupedTransactions).length === 0) {
    return (
      <NBox>
        <Typography variant="list-description">
          {translate('account_details.empty_transacions_msg')}
        </Typography>
      </NBox>
    );
  }

  return (
    <NBox>
      <Stack direction="row" my={4}>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.sent);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.sent}
          variant={'transactionFilter'}
          size={'xs'}>
          <Typography variant="transaction-filter">
            {translate('transaction_details.sent')}
          </Typography>
        </Button>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.received);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.received}
          size={'xs'}
          variant={'transactionFilter'}>
          <Typography variant="transaction-filter">
            {translate('transaction_details.received')}
          </Typography>
        </Button>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.failed);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.failed}
          size={'xs'}
          variant={'transactionFilter'}>
          <Typography variant="transaction-filter">
            {translate('transaction_history.failed')}
          </Typography>
        </Button>
      </Stack>

      {_renderTransactions()}
    </NBox>
  );
}

export function AccountDetailsScreen({
  account,
  onSend,
  onReceive,
  onDelete,
  onBackup,
  onEdit,
  onExport,
  qrCodeData,
  onRefresh,
  isRefreshing,
}) {
  const [accountSettingsVisible, setAccountSettingsVisible] = useState();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState();

  useEffect(() => {
    if (qrCodeData) {
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
            <BackButton onPress={() => navigate(Routes.ACCOUNTS)} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">{account.name}</Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end">
            <Pressable
              onPress={() => setAccountSettingsVisible(true)}
              _pressed={{
                opacity: Theme.touchOpacity,
              }}>
              <DotsVerticalIcon width="22px" height="22px" />
            </Pressable>
          </NBox>
        </Box>
      </Header>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        <Stack mx={4} flex={1}>
          <Stack mx={3} direction="column" alignItems="center">
            <Stack direction="column" alignItems="center" mt={8}>
              <PolkadotIcon address={account.id} size={48} />
              <TokenAmount amount={account.balance}>
                {({fiatAmount, fiatSymbol, tokenAmount, tokenSymbol}) => (
                  <>
                    <Typography variant="h1" fontSize="32px" mt={6}>
                      {tokenAmount} {tokenSymbol}
                    </Typography>
                    <Typography variant="fiat-amount" mt={1}>
                      {formatCurrency(fiatAmount)}
                    </Typography>
                  </>
                )}
              </TokenAmount>
            </Stack>

            <Stack direction="row" width="100%" mt={9} mb={7}>
              <Button
                mr={2}
                flex={1}
                size="sm"
                {...addTestId('SendTokensBtn')}
                disabled={account.readOnly}
                onPress={() =>
                  navigate(Routes.TOKEN_SEND, {
                    address: account.id,
                  })
                }>
                {translate('account_details.send_tokens_btn')}
              </Button>
              <Button
                ml={2}
                flex={1}
                size="sm"
                {...addTestId('ReceiveTokensBtn')}
                onPress={() =>
                  navigate(Routes.TOKEN_RECEIVE, {
                    address: account.id,
                  })
                }>
                {translate('account_details.receive_tokens_btn')}
              </Button>
            </Stack>
          </Stack>
          {account.hasBackup ? null : (
            <Stack
              backgroundColor={Theme.colors.warningBackground}
              p={'16px'}
              mt={5}>
              <Stack direction="row">
                <NBox mr={3} mt={'3px'}>
                  <AlertIcon />
                </NBox>
                <Typography ml={2} variant="h3" fontSize={17}>
                  {translate('account_details.pending_backup')}
                </Typography>
              </Stack>
              <NBox mt={2}>
                <Typography color={Theme.colors.warningText}>
                  {translate('account_details.backup_details')}
                </Typography>
              </NBox>
              <Button
                onPress={onBackup}
                {...addTestId('BackupBtn')}
                mt={4}
                alignSelf="flex-start"
                size="sm"
                backgroundColor="rgba(120, 53, 15, 1)">
                {translate('account_details.backup_btn')}
              </Button>
            </Stack>
          )}
          {account.meta && account.meta.keypairNotFoundWarning ? (
            <Stack
              backgroundColor={Theme.colors.warningBackground}
              p={'16px'}
              mt={5}>
              <Stack direction="row">
                <NBox mr={3} mt={'3px'}>
                  <AlertIcon />
                </NBox>
                <Typography ml={2} variant="h3" fontSize={17}>
                  Keypair not found
                </Typography>
              </Stack>
              <NBox mt={2}>
                <Typography color={Theme.colors.warningText}>
                  Please remove this account and import it from a json file or
                  QR Code
                </Typography>
              </NBox>
            </Stack>
          ) : null}
          <Stack mt={3}>
            <NBox
              borderBottomColor={Theme.colors.tertiaryBackground}
              borderBottomWidth={0.5}
              pb={4}
              pr={0}
              pl={0}>
              <Typography variant="h2">
                {translate('account_details.transactions')}
              </Typography>
            </NBox>
            <NBox>
              <TransactionHistory accountAddress={account.id} />
            </NBox>
          </Stack>
        </Stack>
      </ScrollView>
      <AccountSettingsModal
        visible={accountSettingsVisible}
        onClose={() => setAccountSettingsVisible(false)}
        account={account}
        onDelete={onDelete}
        onExport={onExport}
      />
      <QRCodeModal
        data={qrCodeData}
        title={translate('account_details.export_account')}
        description={translate('account_details.export_account_description')}
        {...addTestId('ExportAccountDescription')}
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
  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(accountOperations.fetchAccountBalance(account.id)).finally(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    dispatch(transactionsOperations.loadTransactions(accountId));
  }, [dispatch, accountId]);

  if (!account) {
    return <LoadingScreen />;
  }

  return (
    <AccountDetailsScreen
      onDelete={() => {
        return dispatch(accountOperations.removeAccount({id: accountId})).then(
          navigateBack,
        );
      }}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
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
