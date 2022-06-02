import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';
import {
  addressHandler,
  credentialHandler,
  executeHandlers,
  qrCodeHandler,
} from './qr-code';
import {navigationRef} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import testCredentialData from '@docknetwork/wallet-sdk-credentials/fixtures/test-credential.json';
import {setToast} from '../../core/toast';
import {onScanAuthQRCode} from '../credentials/credentials';
import {didOperations} from '../didManagement/didManagment-slice';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {credentialServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/credential';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {translate} from 'src/locales';

const mockStore = configureMockStore([thunk]);

describe('qr-code', () => {
  it('executeHandlers', async () => {
    expect(await executeHandlers('test', [])).toBeFalsy();
    expect(await executeHandlers('test', [() => true])).toBeTruthy();
    expect(await executeHandlers('', [() => true])).toBeFalsy();
    expect(await executeHandlers(undefined, [() => true])).toBeFalsy();
  });
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

    it('expect not to trigger handlers for empty data', async () => {
      const data = '';
      const mockHandlers = [jest.fn()];
      await qrCodeHandler(data, mockHandlers);

      expect(mockHandlers[0]).not.toBeCalled();
    });

    it('expect not to show error toast for not handled data', async () => {
      const data = 'data';
      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);
      const mockHandlers = [jest.fn().mockReturnValueOnce(false)];
      await qrCodeHandler(data, mockHandlers);

      expect(mockHandlers[0]).toBeCalled();
      expect(toastMock.show).toBeCalled();
    });
  });
  describe('addressHandler', () => {
    it('expect to ignore invalid data', async () => {
      jest
        .spyOn(utilCryptoService, 'isAddressValid')
        .mockReturnValueOnce(false);

      navigationRef.current = {
        navigate: jest.fn(),
      };

      const result = await addressHandler('some-address');

      expect(result).toBeFalsy();
      expect(navigationRef.current.navigate).not.toBeCalled();
    });

    it('expect to navigate to send tokens route', async () => {
      jest.spyOn(utilCryptoService, 'isAddressValid').mockReturnValueOnce(true);

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

      const credentialData = {
        id: 'test',
        content: 'some-data',
      };

      jest
        .spyOn(Credentials.getInstance(), 'getCredentialFromUrl')
        .mockImplementationOnce(async () => credentialData);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => true);

      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementationOnce(async () => []);

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

      const credentialData = {
        id: Date.now(),
        content: 'some-data',
      };
      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => credentialData);

      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementationOnce(async () => []);

      const result = await credentialHandler(
        JSON.stringify(testCredentialData),
      );

      expect(result).toBeTruthy();
      expect(navigationRef.current.navigate).toBeCalledWith(
        Routes.APP_CREDENTIALS,
        undefined,
      );
    });

    it('expect to not allow duplicated credential', async () => {
      const credentialData = {
        id: 1,
      };

      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => credentialData);
      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementationOnce(async () => [
          {
            content: credentialData,
          },
        ]);

      const result = await credentialHandler(JSON.stringify(credentialData));

      expect(result).toBeTruthy();
      expect(toastMock.show).toBeCalled();
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

    it('expect to onScanAuth0QRCode to generate credential', async () => {
      await expect(onScanAuthQRCode()).rejects.toThrow(
        translate('qr_scanner.no_key_doc', {
          locale: 'en',
        }),
      );

      const store = mockStore({});
      await store.dispatch(didOperations.initializeDID());
      await onScanAuthQRCode();

      const wallet = Wallet.getInstance();
      const keyDocs = wallet.query({});

      const subject = {
        state: 'debugstate',
      };

      expect(credentialServiceRPC.generateCredential).toBeCalledWith({subject});
      const vc = await credentialServiceRPC.generateCredential({});
      expect(credentialServiceRPC.signCredential).toBeCalledWith({
        vcJson: vc,
        keyDoc: keyDocs[0],
      });
    });
  });
});
