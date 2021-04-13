import { getKeyring, initDockSdk } from './features/wallets/wallets-slice';
import dock from '@docknetwork/sdk';

const walletJson = {
  encoded:
    'HJZeKgf2jVbyXo+QDw2wjKZsntTeqNwc5W0nt5GlVDoAgAAAAQAAAAgAAAAeLGat3yoYcbyw6/pa/HteFrktFe+cWdQwUru+7q4S02No88qjxEuY0PPGVF97SKB8EQ6BoAq/ScQbA7rH7y/WtxlJo08j39RuM9VWX63pJhPr0CX7XQovFQIY8jaKUj4AH4W38I6KNStlngAanp/mJ37tUX7uu21xpCQxWPPEVmKo7GR4X1J9pS2rjrGFXsyszUxiU9f87WlbDnhC',
  encoding: {
    content: ['pkcs8', 'ed25519'],
    type: ['scrypt', 'xsalsa20-poly1305'],
    version: '3',
  },
  address: '5FmpCyW1sxpwD9zWQEhPcisiEbtdgYZo48G5JLCdqwbPeMCz',
  meta: {
    name: 'Test wallet',
    
  },
};

let keyring;
let account;

describe('Dock Sdk', () => {
  beforeAll(async () => {
    keyring = await getKeyring();
    await initDockSdk();

    account = keyring.addFromJson(walletJson, true);
    account.unlock('mnemdm25');
  });

  describe('polkadot basic', () => {
    it('get account balance', async () => {
      // https://polkadot.js.org/docs/api/examples/promise/listen-to-balance-change/
      const { data: { free: currentFree }} = await dock.api.query.system.account(account.address);

      console.log(`Account balance is ${currentFree.toHuman()}`);

      expect(currentFree).toBeDefined();
    });

    it('get chain info', async () => {
      // https://polkadot.js.org/docs/api/examples/promise/chain-info
      const chainInfo = await dock.api.registry.getChainProperties()

      console.log(`Chain info: ${JSON.stringify(chainInfo)}`);

      expect(chainInfo.tokenSymbol.toString()).toBe('DCK');
      expect(parseInt(chainInfo.tokenDecimals)).toBe(6);
      expect(parseInt(chainInfo.ss58Format)).toBe(42);
    });

    it('events', async () => {
      // https://polkadot.js.org/docs/api/examples/promise/chain-info
      const signedBlock = await dock.api.rpc.chain.getBlock();

      // the information for each of the contained extrinsics
      signedBlock.block.extrinsics.forEach((ex, index) => {
        // the extrinsics are decoded by the API, human-like view
        console.log(index, ex.toHuman());

        const { isSigned, meta, method: { args, method, section } } = ex;

        // explicit display of name, args & documentation
        console.log(`${section}.${method}(${args.map((a) => a.toString()).join(', ')})`);
        console.log(meta.documentation.map((d) => d.toString()).join('\n'));

        // signer/nonce info
        if (isSigned) {
          console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
        }
      });
    });
  });
});
