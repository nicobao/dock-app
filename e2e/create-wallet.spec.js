
describe('Create Wallet', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('Expect to have unlock button', async () => {
    await waitFor(element(by.id('createWalletScreen'))).toBeVisible().withTimeout(5000)
    await expect(element(by.id('createWalletBtn'))).toBeVisible();
  });
});
