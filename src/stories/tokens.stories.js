import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {AccountIcon} from 'src/design-system';
import {ConfirmTransactionModal} from 'src/features/tokens/ConfirmTransactionModal';
import {TransactionHistory} from 'src/features/tokens/TransactionHistory';
import {ReceiveTokenScreen} from '../features/tokens/ReceiveTokenScreen';
import {
  EnterTokenAmount,
  SendTokenScreen,
} from '../features/tokens/SendTokenScreen';
storiesOf('Tokens', module)
  .add('1. Receive Token', () => (
    <ReceiveTokenScreen
      address={'3B9W5fS4ygoUVnGhzTk7sihSdhCyJQRNMQ7aJfDdsfWb16f1'}
      accountName="cocomelon"
      accountIcon={<AccountIcon />}
    />
  ))
  .add('2. Send Token', () => (
    <SendTokenScreen
      onChange={lbl => null}
      form={{
        recipientAddress: 'addresstest',
      }}
    />
  ))
  .add('3. Enter Token Amount', () => (
    <EnterTokenAmount
      amount={223}
      fiatAmount={130}
      fiatSymbol="USD"
      tokenSymbol="DOCK"
      onChange={v => console.log(v)}
    />
  ))
  .add('4. Confirm Transaction', () => (
    <ConfirmTransactionModal
      visible={true}
      recipientAddress={'3B9W5fS4ygoUVnGhzTk7sihSdhCyJQRNMQ7aJfDdsfWb16f1'}
      sentAmount={2000}
      fee={100}
      tokenSymbol="DOCK"
      fiatAmount={150}
      fiatSymbol="USD"
      accountName="cocomelon"
      accountIcon={<AccountIcon />}
    />
  ))
  .add('4. Confirm Transaction', () => (
    <TransactionHistory
      visible={true}
      transactions={[
        {
          status: 'in_progress',
          amount: 1995,
          date: new Date(),
          recipientAddress: '3B9W5fS4ygoUVnGhzTk7sihSdhCyJQRNMQ7aJfDdsfWb16f1',
          recipientIcon: <AccountIcon />,
          nonce: 12345,
          hash: 'transaction-hash',
        },
      ]}
    />
  ));
