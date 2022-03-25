import {translate} from 'src/locales';

describe('Wallet Slice', () => {
  it('expect to remove account from store', () => {
    expect('Invalid backup file or incorrect password').toBe(
      translate('import_wallet.import_error', {
        locale: 'en',
      }),
    );
  });
});
