import {renderHook} from '@testing-library/react-hooks';
import {
  useCredentials,
  getDIDAddress,
  formatCredential,
  generateAuthVC,
} from './credentials';
import {CREDENTIAL_STATUS} from '@docknetwork/wallet-sdk-react-native/lib';
import {useCredentialUtils} from '@docknetwork/wallet-sdk-react-native/lib';
import * as modals from '../../components/ConfirmationModal';

describe('Credentials helpers', () => {
  describe('generateAuthVC', () => {
    it('expect a valid credential with terms of use', () => {
      const credential = generateAuthVC(
        {controller: 'did:test:123'},
        {
          id: 'my subject',
          state: 'state',
        },
      );

      expect(credential['@context']).toBeDefined();
      expect(credential.id).toBeDefined();
      expect(credential.type).toBeDefined();
      expect(credential.expirationDate).toBeDefined();
      expect(credential.credentialSubject).toBeDefined();
      expect(credential.credentialSubject.id).toEqual('my subject');
      expect(credential.credentialSubject.state).toEqual('state');
      expect(credential.id).toEqual('didauth:state');
      expect(credential.type[0]).toEqual('VerifiableCredential');
      expect(credential.type[1]).toEqual('DockAuthCredential');
      expect(credential.termsOfUse).toBeDefined();
      expect(credential.termsOfUse[0]).toBeDefined();
      expect(credential.termsOfUse[0].type).toBeDefined();
      expect(credential.termsOfUse[0].type).toEqual('IssuerPolicy');
      expect(credential.termsOfUse[0].prohibition[0]).toBeDefined();
    });

    it('expect throw for invalid controller', () => {
      expect(() => generateAuthVC(null, {id: 'test'})).toThrowError();
    });

    it('expect throw for invalid subject', () => {
      expect(() =>
        generateAuthVC({controller: 'did:test:123'}, null),
      ).toThrowError();
    });
  });

  it('getDIDAddress from issuer object', () => {
    expect(getDIDAddress()).toBe(null);
    expect(
      getDIDAddress({
        id: 'did:dock:5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      }),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
    expect(
      getDIDAddress({
        id: 'did:other:5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      }),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
    expect(
      getDIDAddress({
        id: '5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      }),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
  });

  it('getDIDAddress', () => {
    expect(getDIDAddress()).toBe(null);
    expect(
      getDIDAddress(
        'did:dock:5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      ),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
    expect(
      getDIDAddress(
        'did:other:5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      ),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
    expect(
      getDIDAddress('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A'),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
  });

  describe('processCredential', () => {
    it('expect to remove timezone offset', async () => {
      const issuanceDate = new Date('2022-04-24T00:53:13.265Z');
      const credential = {
        issuanceDate,
        type: ['VerifiableCredential'],
        credentialSubject: {},
        issuer: 'did:dock:xyz',
      };
      const result = await formatCredential({content: credential});
      expect(result.content.issuanceDate.getDate()).toBe(24);
      expect(result.content.issuanceDate.getMonth()).toBe(3);
    });

    it('expect to handle bad data', async () => {
      await expect(formatCredential({})).rejects.toThrowError();

      await expect(formatCredential(null)).rejects.toThrowError();
    });
  });

  describe('useCredentials', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('expect to delete credential', async () => {
      const onPickFile = jest.fn().mockResolvedValue({});
      const {result} = await renderHook(() => useCredentials({onPickFile}));
      const {result: useCredentialUtilsResult} = await renderHook(() =>
        useCredentialUtils(),
      );
      await result.current.handleRemove({id: 1});

      expect(useCredentialUtilsResult.current.deleteCredential).toBeCalledWith(
        1,
      );
    });

    it('expect to throw exception if credential has missing id', async () => {
      const onPickInvalidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: {
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickInvalidFile}),
      );

      await expect(result.current.onAdd()).rejects.toThrowError(
        'Credential has no ID',
      );
    });
    it('expect to throw exception if credential only has missing @context', async () => {
      const onPickInvalidFile = jest.fn().mockResolvedValue({
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: {
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickInvalidFile}),
      );

      await expect(result.current.onAdd()).rejects.toThrowError(
        'Credential has no context',
      );
    });
    it('expect to throw exception if credential has invalid type', async () => {
      const onPickInvalidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['UniversityDegreeCredential'],
        issuer: {
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickInvalidFile}),
      );

      await expect(result.current.onAdd()).rejects.toThrowError(
        'Credential has an invalid type',
      );
    });
    it('expect to throw exception if credential has EncryptedWallet as type', async () => {
      const onPickInvalidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['EncryptedWallet'],
        issuer: {
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickInvalidFile}),
      );

      await expect(result.current.onAdd()).rejects.toThrowError(
        'Credential has an invalid type',
      );
    });
    it('expect to throw exception if credential has UniversalWallet2020 as type', async () => {
      const onPickInvalidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['UniversalWallet2020'],
        issuer: {
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickInvalidFile}),
      );

      await expect(result.current.onAdd()).rejects.toThrowError(
        'Credential has an invalid type',
      );
    });
    it('expect to throw exception if credential only has no issuer', async () => {
      const onPickInvalidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['UniversityDegreeCredential', 'VerifiableCredential'],
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickInvalidFile}),
      );

      await expect(result.current.onAdd()).rejects.toThrowError(
        'Credential has no Issuer',
      );
    });

    it('expect to add valid credential with string issuer', async () => {
      const onPickValidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2029-06-26T23:00:00.000Z',
        issuer: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickValidFile}),
      );
      const {result: useCredentialUtilsResult} = await renderHook(() =>
        useCredentialUtils(),
      );
      await result.current.onAdd();

      expect(useCredentialUtilsResult.current.saveCredential).toBeCalledWith({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2029-06-26T23:00:00.000Z',
        issuer: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
      });
    });
    it('expect to add valid credential with issuer object', async () => {
      const onPickValidFile = jest.fn().mockResolvedValue({
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
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickValidFile}),
      );
      const {result: useCredentialUtilsResult} = await renderHook(() =>
        useCredentialUtils(),
      );
      await result.current.onAdd();

      expect(useCredentialUtilsResult.current.saveCredential).toBeCalledWith({
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
      });
    });

    it('expect to confirm before importing invalid credential', async () => {
      const onPickValidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2019-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
        status: CREDENTIAL_STATUS.INVALID,
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickValidFile}),
      );

      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      await result.current.onAdd();
      expect(modals.showConfirmationModal).toBeCalled();
    });
    it('expect to confirm before importing expired credential', async () => {
      const onPickValidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2019-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
        status: CREDENTIAL_STATUS.EXPIRED,
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickValidFile}),
      );

      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      await result.current.onAdd();
      expect(modals.showConfirmationModal).toBeCalled();
    });
    it('expect to confirm before importing revoked credential', async () => {
      const onPickValidFile = jest.fn().mockResolvedValue({
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'https://creds.dock.io/8e02c35ae370b02f47d7faaf41cb1386768fc75c9fca7caa6bb389dbe61260eb',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        credentialSubject: {},
        issuanceDate: '2022-06-27T12:08:30.675Z',
        expirationDate: '2019-06-26T23:00:00.000Z',
        issuer: {
          name: 'John Doe',
          description: '',
          logo: '',
          id: 'did:dock:5CJaTP2eGCLf5ZNPUXYbWxUvJQMTseKfc4hi8WVBC1K8eW9N',
        },
        status: CREDENTIAL_STATUS.REVOKED,
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickValidFile}),
      );

      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      await result.current.onAdd();
      expect(modals.showConfirmationModal).toBeCalled();
    });
    it('expect not to confirm before importing a valid credential', async () => {
      const onPickValidFile = jest.fn().mockResolvedValue({
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
      });
      const {result} = await renderHook(() =>
        useCredentials({onPickFile: onPickValidFile}),
      );

      jest
        .spyOn(modals, 'showConfirmationModal')
        .mockImplementationOnce(async () => []);
      await result.current.onAdd();
      expect(modals.showConfirmationModal).toHaveBeenCalledTimes(0);
    });
  });
});
