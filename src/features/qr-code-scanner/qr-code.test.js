import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';
import {
  addressHandler,
  authHandler,
  credentialHandler,
  executeHandlers,
  isDidAuthUrl,
  onAuthQRScanned,
  qrCodeHandler,
  isDeepLinkType,
  onPresentationScanned,
  importAccountHandler,
  qrCodeHandlers,
} from './qr-code';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import testCredentialData from '@docknetwork/wallet-sdk-credentials/fixtures/test-credential.json';
import {setToast} from '../../core/toast';
import {getParamsFromUrl, onScanAuthQRCode} from '../credentials/credentials';
import {credentialServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/credential';
import {translate} from 'src/locales';
import {CREDENTIAL_STATUS} from '@docknetwork/wallet-sdk-react-native/lib';
import * as modals from '../../components/ConfirmationModal';

const keyDoc = {
  '@context': ['https://w3id.org/wallet/v1'],
  id: 'urn:uuid:e8fc7810-9524-11ea-bb37-0242ac130002',
  name: 'My Test Key 2',
  image: 'https://via.placeholder.com/150',
  description: 'For testing only, totally compromised.',
  tags: ['professional', 'organization', 'compromised'],
  correlation: ['4058a72a-9523-11ea-bb37-0242ac130002'],
  controller: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
  type: 'Ed25519VerificationKey2018',
  privateKeyBase58:
    '3CQCBKF3Mf1tU5q1FLpHpbxYrNYxLiZk4adDtfyPEfc39Wk6gsTb2qoc1ZtpqzJYdM1rG4gpaD3ZVKdkiDrkLF1p',
  publicKeyBase58: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
};

describe('qr-code', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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

      const result = await addressHandler('some-address');

      expect(result).toBeFalsy();
      expect(navigate).not.toBeCalled();
    });

    it('expect to navigate to send tokens route', async () => {
      jest.spyOn(utilCryptoService, 'isAddressValid').mockReturnValueOnce(true);

      const address = 'some-address';
      const result = await addressHandler(address);

      expect(result).toBeTruthy();
      expect(navigate).toBeCalledWith(Routes.TOKEN_SEND, {
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
      expect(navigate).not.toBeCalled();
      expect(toastMock.show).toBeCalled();
    });

    it('expect to show confirm dialog after scanning invalid credential', async () => {
      const credentialData = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2029-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
        status: CREDENTIAL_STATUS.INVALID,
      };
      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      jest
        .spyOn(Credentials.getInstance(), 'getCredentialFromUrl')
        .mockImplementationOnce(async () => credentialData);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => true);

      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementationOnce(async () => []);

      await credentialHandler('http://some-url');

      expect(modals.showConfirmationModal).toBeCalled();
    });
    it('expect to show confirm dialog after scanning revoked credential', async () => {
      const credentialData = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2029-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
        status: CREDENTIAL_STATUS.REVOKED,
      };
      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      jest
        .spyOn(Credentials.getInstance(), 'getCredentialFromUrl')
        .mockImplementationOnce(async () => credentialData);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => true);

      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementationOnce(async () => []);

      await credentialHandler('http://some-url');

      expect(modals.showConfirmationModal).toBeCalled();
    });
    it('expect to show confirm dialog after scanning expired credential', async () => {
      const credentialData = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2029-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
        status: CREDENTIAL_STATUS.EXPIRED,
      };
      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      jest
        .spyOn(Credentials.getInstance(), 'getCredentialFromUrl')
        .mockImplementationOnce(async () => credentialData);

      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementationOnce(async () => true);

      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementationOnce(async () => []);

      await credentialHandler('http://some-url');

      expect(modals.showConfirmationModal).toBeCalled();
    });
    it('expect to add credential from url', async () => {
      const credentialData = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2029-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
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

      expect(modals.showConfirmationModal).not.toBeCalled();
      expect(result).toBeTruthy();
      expect(navigate).toBeCalledWith(Routes.APP_CREDENTIALS);
    });

    it('expect to handle json data', async () => {
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
      expect(navigate).toBeCalledWith(Routes.APP_CREDENTIALS);
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
      const toastMock = {
        show: jest.fn(),
      };
      setToast(toastMock);

      jest.spyOn(Credentials.getInstance(), 'add');

      const result = await credentialHandler('{d: bad json)');

      expect(result).toBeFalsy();
    });

    it('expect to onScanAuth0QRCode to error with no keydoc', async () => {
      await expect(
        onScanAuthQRCode('https://url.com', null, {}),
      ).rejects.toThrow(
        translate('qr_scanner.no_key_doc', {
          locale: 'en',
        }),
      );
    });

    it('expect to onScanAuth0QRCode to generate credential', async () => {
      const url =
        'https://auth.dock.io/verify?id=dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW&scope=public email';

      await onScanAuthQRCode(url, keyDoc, {});

      expect(credentialServiceRPC.signCredential).toBeCalled();
    });
    it('is Presentation QRCode scanned', () => {
      const isValid1 = onPresentationScanned(
        'allet://proof-?ul=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(isValid1).toBeFalsy();
      expect(navigate).not.toBeCalled();
      const res = onPresentationScanned(
        'dockwallet://proof-request?url=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(navigate).toBeCalledWith(
        'credential/shareCredentialAsPresentation',
        {
          deepLinkUrl:
            'dockwallet://proof-request?url=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
        },
      );
      expect(res).toBeTruthy();
    });
    it('is Auth QRCode scanned', () => {
      const res = onAuthQRScanned(
        'dockwallet://didauth?url=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(res).toBeTruthy();
      const isValid1 = onAuthQRScanned(
        'dockwallet://didauth?ul=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(isValid1).toBeFalsy();
    });

    it('is presentation URL', () => {
      const isValid = isDeepLinkType(
        'dockwallet://proof-request?url=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
        'dockwallet://proof-request?url=',
      );
      expect(isValid).toBeTruthy();
      const isValid1 = isDeepLinkType(
        'dockwallet://proof-equest?url=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
        'dockwallet://proof-request?url=',
      );
      expect(isValid1).toBeFalsy();
    });
    it('Is did auth URL', () => {
      const isValid = isDidAuthUrl(
        'dockwallet://didauth?url=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(isValid).toBeTruthy();
      const isValid1 = isDidAuthUrl(
        'dockwallet://didauth?ul=https://auth.dock.io/verify?id=dockstagingtestRgMV0IwPQELYDbVkGXUfMQnOb912660w&scope=public email',
      );
      expect(isValid1).toBeFalsy();
    });

    it('Get param from url', () => {
      const url =
        'https://auth.dock.io/verify?id=dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW&scope=public email';
      const id = getParamsFromUrl(url, 'id');
      expect(id).toBe('dockstagingtestHsBR-jkCCPl4sBOh3f3_n66r9X1uIKgW');
    });

    it('expect authHandler to sign and upload vc', async () => {
      await authHandler(
        'dockwallet://didauth?url=https%3A%2F%2Fauth.dock.io%2Fverify%3Fid%3Dqi0hkXbZQzpuAVgzM6Zkq905w0LnegROzDrsvy0W%26scope%3Dpublic%20email',
        keyDoc,
      );
      expect(fetch).toHaveBeenCalledWith(
        'https://auth.dock.io/verify?id=qi0hkXbZQzpuAVgzM6Zkq905w0LnegROzDrsvy0W&scope=public email',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: expect.any(String),
        },
      );
    });
    it('Include presentation QR handlers', () => {
      expect(qrCodeHandlers.includes(onPresentationScanned)).toBeTruthy();
    });
  });
  describe('importAccountHandler', () => {
    it('Include import account QR handlers', () => {
      expect(qrCodeHandlers.includes(importAccountHandler)).toBeTruthy();
    });
    it('is import QRCode scanned', async () => {
      const isValid1 = await importAccountHandler('{"wallet":"","encoded":{}}');
      expect(isValid1).toBeFalsy();

      const res = await importAccountHandler('{"address":"","encoded":{}}');
      expect(res).toBeTruthy();
    });
  });
});
