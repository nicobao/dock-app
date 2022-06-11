import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';
import {
  addressHandler,
  authHandler,
  credentialHandler,
  executeHandlers,
  isDidAuthUrl,
  qrCodeHandler,
} from './qr-code';
import {navigationRef} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import testCredentialData from '@docknetwork/wallet-sdk-credentials/fixtures/test-credential.json';
import {setToast} from '../../core/toast';
import {getParamsFromUrl, onScanAuthQRCode} from '../credentials/credentials';
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
      const url =
        'https://auth-server-i78ydv67d-docklabs.vercel.app/verify?id=dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW&scope=public email';
      await expect(onScanAuthQRCode(url)).rejects.toThrow(
        translate('qr_scanner.no_key_doc', {
          locale: 'en',
        }),
      );
      const store = mockStore({});
      await store.dispatch(didOperations.initializeDID());
      await onScanAuthQRCode(url);

      const subject = {
        state: 'dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW',
      };

      expect(credentialServiceRPC.generateCredential).toBeCalledWith({subject});
      await credentialServiceRPC.generateCredential({});
      expect(credentialServiceRPC.signCredential).toBeCalled();
    });

    it('Is did auth URL', () => {
      const isValid = isDidAuthUrl(
        'dockwallet://didauth?url=https://auth-server-i78ydv67d-docklabs.vercel.app/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(isValid).toBeTruthy();
      const isValid1 = isDidAuthUrl(
        'dockwallet://didauth?ul=https://auth-server-i78ydv67d-docklabs.vercel.app/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(isValid1).toBeFalsy();
    });

    it('Get param from url', () => {
      const url =
        'https://auth-server-i78ydv67d-docklabs.vercel.app/verify?id=dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW&scope=public email';
      const id = getParamsFromUrl(url, 'id');
      expect(id).toBe('dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW');
    });

    it('expect authHandler to sign and upload vc', async () => {
      await authHandler(
        'dockwallet://didauth?url=https%3A%2F%2Fauth.dock.io%2Fverify%3Fid%3Dqi0hkXbZQzpuAVgzM6Zkq905w0LnegROzDrsvy0W%26scope%3Dpublic%20email',
      );
      expect(fetch).toHaveBeenCalledWith(
        'https://auth.dock.io/verify?id=qi0hkXbZQzpuAVgzM6Zkq905w0LnegROzDrsvy0W&scope=public email',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            vc: {
              '@context': [
                'https://www.w3.org/2018/credentials/v1',
                {
                  dk: 'https://ld.dock.io/credentials#',
                  DockAuthCredential: 'dk:DockAuthCredential',
                  name: 'dk:name',
                  email: 'dk:email',
                  state: 'dk:state',
                  description: 'dk:description',
                  logo: 'dk:logo',
                },
              ],
              id: 'didauth:dock:clientid',
              type: ['VerifiableCredential', 'DockAuthCredential'],
              credentialSubject: {
                name: 'John Doe',
                email: 'test@dock.io',
                state: 'debugstate',
              },
              issuanceDate: '2022-04-01T18:26:21.637Z',
              expirationDate: '2023-04-01T18:26:21.637Z',
              proof: {
                type: 'Ed25519Signature2018',
                created: '2022-05-13T17:57:12Z',
                verificationMethod:
                  'did:dock:5FbQXJULrLt8kymWe4ScrM2MyRWAweYXCQ79EpL7ADUV2H8Y#keys-1',
                proofPurpose: 'assertionMethod',
                proofValue:
                  'z4ndjdQcqyypWAdtmRcz8KRh6cMzQCuDrQfq4fwa7WdANtxjsXje8UN7Pc16w1DDYNWdrWuV75bWvd6H2VDYfG1qB',
              },
              issuer: {
                name: 'Auth Test',
                description: 'test',
                logo: '',
                id: 'did:dock:5FbQXJULrLt8kymWe4ScrM2MyRWAweYXCQ79EpL7ADUV2H8Y',
              },
            },
          }),
        },
      );
    });
  });
});
