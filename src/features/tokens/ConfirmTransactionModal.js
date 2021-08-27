import React, {useEffect, useState} from 'react';
import {Box, Pressable, Stack} from 'native-base';
import {
  DocumentDownloadIcon,
  PlusCircleIcon,
  Text,
  OptionList,
  BackIcon,
  Button,
} from 'src/design-system';
import {Modal} from '../../components/Modal';
import {translate} from 'src/locales';
import {Typography} from '../../design-system';
import {getDockTokenPrice} from './price-service';

export function TokenAmount({amount, symbol, children}) {
  const [fiatAmount, setFiatAmount] = useState(0);
  const fiatSymbol = 'USD';

  useEffect(() => {
    getDockTokenPrice().then(price => setFiatAmount(amount * price));
  }, [amount]);

  return children({
    fiatAmount,
    fiatSymbol,
    tokenAmount: amount,
    tokenSymbol: symbol,
  });
}

export function AmountDetails(props) {
  return (
    <TokenAmount {...props}>
      {({fiatAmount, fiatSymbol, tokenAmount, tokenSymbol}) => (
        <Stack direction="row">
          <Typography mr={2}>
            {tokenAmount} {tokenSymbol}
          </Typography>
          <Typography>
            {fiatAmount} {fiatSymbol}
          </Typography>
        </Stack>
      )}
    </TokenAmount>
  );
}

export function ConfirmTransactionModal({
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
