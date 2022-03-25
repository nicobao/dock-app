import {translate} from 'src/locales';

describe('Wallet Slice', () => {
  it('expect error message to be accurate', () => {
    expect('Invalid backup file or incorrect password').toBe(
      translate('import_wallet.import_error', {
        locale: 'en',
      }),
    );
  });
});
