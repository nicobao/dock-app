import {Button, Stack} from 'native-base';
import React from 'react';
import {useDispatch} from 'react-redux';
import {Modal} from 'src/components/Modal';
import {DOCK_TOKEN_UNIT} from 'src/core/format-utils';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {Box, Typography} from '../../design-system';
import {translate} from '../../locales';
import {AmountDetails} from '../tokens/ConfirmTransactionModal';
import {transactionsOperations} from './transactions-slice';

export function TransactionConfirmationModal({visible, onClose, transaction}) {
  const {
    amount,
    tokenSymbol = 'DOCK',
    recipientAddress,
    feeAmount,
    fromAddress,
  } = transaction;

  const dispatch = useDispatch();

  return (
    <Modal visible={visible} onClose={onClose} modalSize={0.75}>
      <Stack p={8}>
        <Typography variant="h1" mb={4}>
          {translate('confirm_transaction.title')}
        </Typography>
        <Stack mb={2}>
          <Typography mb={1}>
            {translate('confirm_transaction.send')}
          </Typography>
          <AmountDetails amount={amount} symbol={tokenSymbol} />
        </Stack>
        <Stack mb={2}>
          <Box>
            <Typography mb={1}>
              {translate('confirm_transaction.to')}
            </Typography>
          </Box>
          <Stack direction="row">
            <Box pl={5}>
              <PolkadotIcon size={30} address={recipientAddress} />
            </Box>
            <Box pr={15}>
              <Typography ml={2}>{recipientAddress}</Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack mb={2}>
          <Typography mb={1}>{translate('confirm_transaction.fee')}</Typography>
          <AmountDetails amount={feeAmount} symbol={tokenSymbol} />
        </Stack>
        <Stack mb={5}>
          <Typography mb={1}>
            {translate('confirm_transaction.total')}
          </Typography>
          <AmountDetails amount={amount} symbol={tokenSymbol} />
        </Stack>
        <Button
          onPress={() => {
            dispatch(
              transactionsOperations.sendTransaction({
                recipientAddress,
                accountAddress: fromAddress,
                fee: feeAmount,
                amount: parseFloat(amount) / DOCK_TOKEN_UNIT,
                prevTransaction: transaction,
              }),
            ).finally(onClose);
          }}>
          {translate('confirm_transaction.submit')}
        </Button>
      </Stack>
    </Modal>
  );
}
