import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {addressHandler, credentialHandler, qrCodeHandler} from './qr-code';
import {navigationRef} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import testCredentialData from '@docknetwork/wallet-sdk-credentials/fixtures/test-credential.json';
import {setToast} from '../../core/toast';

describe('qr-code', () => {
  describe('qr code handler', () => {
    const handler1 = jest
      .fn()
      .mockImplementation(async data => data === 'handler1');
    const handler2 = jest
      .fn()
      .mockImplementation(async data => data === 'handler2');
    const handlers = [handler1, handler2];

    it('expect to trigger handler1', async () => {
      const data = 'handler1';
      await qrCodeHandler(data, handlers);

      expect(handler1).toBeCalledWith(data);
      expect(handler2).not.toBeCalled();
    });

    it('expect to trigger handler2', async () => {
      const data = 'handler2';
      await qrCodeHandler(data, handlers);

      expect(handler1).toBeCalledWith(data);
      expect(handler2).toBeCalledWith(data);
    });
  });
  describe('addressHandler', () => {
    it('expect to ignore invalid data', async () => {
      jest.spyOn(UtilCryptoRpc, 'isAddressValid').mockReturnValueOnce(false);

      navigationRef.current = {
        navigate: jest.fn(),
      };

      const result = await addressHandler('some-address');

      expect(result).toBeFalsy();
      expect(navigationRef.current.navigate).not.toBeCalled();
    });

    it('expect to navigate to send tokens route', async () => {
      jest.spyOn(UtilCryptoRpc, 'isAddressValid').mockReturnValueOnce(true);

      navigationRef.current = {
        navigate: jest.fn(),
      };

      const address = 'some-address';
      const result = await addressHandler(address);

      expect(result).toBeTruthy();
      expect(navigationRef.current.navigate).toBeCalledWith(Routes.TOKEN_SEND, {
        address,
      });
    });
  });

  describe('credentialHandler', () => {
    beforeAll(() => {
      Credentials.getInstance().wallet = {
        add: data => data,
      };
    });

    it('expect to ignore invalid data', async () => {
      navigationRef.current = {
        navigate: jest.fn(),
      };

      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);

      jest
        .spyOn(Credentials.getInstance(), 'getCredentialFromUrl')
        .mockImplementationOnce(async () => {
          throw new Error('Invalid credential');
        });

      const result = await credentialHandler('http://some-url');

      expect(result).toBeFalsy();
      expect(navigationRef.current.navigate).not.toBeCalled();
      expect(toastMock.show).toBeCalled();
    });

    it('expect to add credential from url', async () => {
      navigationRef.current = {
        navigate: jest.fn(),
      };

      const credentialData = 'some-data';
      jest
        .spyOn(Credentials.getInstance(), 'getCredentialFromUrl')
        .mockImplementationOnce(async () => credentialData);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => true);

      const result = await credentialHandler('http://some-url');

      expect(result).toBeTruthy();
      expect(navigationRef.current.navigate).toBeCalledWith(
        Routes.APP_CREDENTIALS,
        undefined,
      );
    });

    it('expect to handle json data', async () => {
      navigationRef.current = {
        navigate: jest.fn(),
      };

      const credentialData = 'some-data';
      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => credentialData);

      const result = await credentialHandler(
        JSON.stringify(testCredentialData),
      );

      expect(result).toBeTruthy();
      expect(navigationRef.current.navigate).toBeCalledWith(
        Routes.APP_CREDENTIALS,
        undefined,
      );
    });

    it('expect to handle malformed json', async () => {
      navigationRef.current = {
        navigate: jest.fn(),
      };

      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);

      jest.spyOn(Credentials.getInstance(), 'add');

      const result = await credentialHandler('{d: bad json)');

      expect(result).toBeFalsy();
    });
  });
});
