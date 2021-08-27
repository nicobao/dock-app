import {Stack} from 'native-base';
import React from 'react';
import {Button} from 'src/design-system';
import {translate} from 'src/locales';
import {Modal} from '../../components/Modal';
import {Typography} from '../../design-system';
import {AmountDetails} from './ConfirmTransactionModal';

export function TransactionHistory({
  onClose,
  onConfirm,
  visible,
  accountIcon,
  tokenSymbol,
  sentAmount,
  fee,
  recipientAddress,
}) {
  return (
    <Modal visible={visible} onClose={onClose} modalSize={0.6}>
      <Stack p={8}>
        <Typography variant="h1" mb={4}>
          {translate('confirm_transaction.title')}
        </Typography>
        <Stack mb={2}>
          <Typography mb={1}>
            {translate('confirm_transaction.send')}
          </Typography>
          <AmountDetails amount={sentAmount} symbol={tokenSymbol} />
        </Stack>
        <Stack>
          <Typography mb={1}>{translate('confirm_transaction.to')}</Typography>
          <Stack direction="row">
            {accountIcon}
            <Typography ml={2}>{recipientAddress}</Typography>
          </Stack>
        </Stack>
        <Stack mb={2}>
          <Typography mb={1}>{translate('confirm_transaction.fee')}</Typography>
          <AmountDetails amount={fee} symbol={tokenSymbol} />
        </Stack>
        <Stack mb={2}>
          <Typography mb={1}>
            {translate('confirm_transaction.total')}
          </Typography>
          <AmountDetails amount={sentAmount + fee} symbol={tokenSymbol} />
        </Stack>
      </Stack>
      <Button onPress={onConfirm}>
        {translate('confirm_transaction.submit')}
      </Button>
    </Modal>
  );
}
