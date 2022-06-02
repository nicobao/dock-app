import {WalletSDKProvider} from '@docknetwork/wallet-sdk-react-native/lib';

describe('Wallet sdk integration', () => {
  it('react native', () => {
    expect(WalletSDKProvider).toBeDefined();
  });
});
