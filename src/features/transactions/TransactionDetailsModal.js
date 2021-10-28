import {Stack} from 'native-base';
import React from 'react';
import {Modal} from 'src/components/Modal';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {Box, Typography} from '../../design-system';
import {translate} from '../../locales';
import {AmountDetails} from '../tokens/ConfirmTransactionModal';

export function TransactionDetailsModal({
  visible,
  onClose,
  transaction,
  accountAddress,
}) {
  const {
    amount,
    tokenSymbol = 'DOCK',
    recipientAddress,
    feeAmount,
    fromAddress,
  } = transaction;

  const isReceived = recipientAddress === accountAddress;
  const details = isReceived
    ? {
        action: translate('transaction_details.received'),
        direction: translate('transaction_details.from'),
        address: fromAddress,
      }
    : {
        action: translate('transaction_details.sent'),
        direction: translate('transaction_details.to'),
        address: recipientAddress,
      };

  return (
    <Modal visible={visible} onClose={onClose} modalSize={0.75}>
      <Stack p={8}>
        <Typography variant="h1" mb={4}>
          {translate('transaction_details.title')}
        </Typography>
        <Stack mb={2}>
          <Typography mb={1}>{details.action}</Typography>
          <AmountDetails amount={amount} symbol={tokenSymbol} />
        </Stack>
        <Stack mb={2}>
          <Box>
            <Typography mb={1}>{details.direction}</Typography>
          </Box>
          <Stack direction="row" pr={8}>
            <Box pl={5}>
              <PolkadotIcon size={30} address={details.address} />
            </Box>
            <Box>
              <Typography ml={2}>{details.address}</Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack mb={2}>
          <Typography mb={1}>{translate('transaction_details.fee')}</Typography>
          <AmountDetails amount={feeAmount} symbol={tokenSymbol} />
        </Stack>
        <Stack mb={5}>
          <Typography mb={1}>
            {translate('transaction_details.total')}
          </Typography>
          <AmountDetails amount={amount} symbol={tokenSymbol} />
        </Stack>
      </Stack>
    </Modal>
  );
}
