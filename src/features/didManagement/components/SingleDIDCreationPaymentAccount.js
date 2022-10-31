import {NBox, Typography} from '../../../design-system';
import React from 'react';
import {HStack, Stack} from 'native-base';
import {TokenAmount} from '../../tokens/ConfirmTransactionModal';
export function SingleDIDCreationPaymentAccount({item}) {
  return (
    <NBox>
      <HStack mb={1}>
        <Typography
          style={{
            flexGrow: 1,
          }}
          numberOfLines={1}
          textAlign="left"
          variant="description">
          {item.label}
        </Typography>
        <TokenAmount amount={item.balance}>
          {({tokenAmount, tokenSymbol}) => (
            <>
              <Stack direction="column">
                <Typography variant="description">
                  {tokenAmount} {tokenSymbol}
                </Typography>
              </Stack>
            </>
          )}
        </TokenAmount>
      </HStack>
      <Typography
        numberOfLines={1}
        textAlign="left"
        variant="screen-description">
        {item.description}
      </Typography>
    </NBox>
  );
}
