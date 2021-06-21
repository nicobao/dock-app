import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {CreatePasscodeScreen} from '../features/create-wallet/CreatePasscodeScreen';
import {CreateWalletScreen} from '../features/create-wallet/CreateWalletScreen';
import {SetupPasscodeScreen} from '../features/create-wallet/SetupPasscodeScreen';
import {ProtectYourWalletScreen} from '../features/create-wallet/ProtectYourWalletScreen';

storiesOf('Wallet creation', module)
  .add('Create Wallet', () => <CreateWalletScreen />)
  .add('Setup Passcode', () => <SetupPasscodeScreen />)
  .add('Create Passcode', () => <CreatePasscodeScreen text="Create your passcode" />)
  .add('Protect your wallet', () => <ProtectYourWalletScreen />);
