import {renderHook, act} from '@testing-library/react-hooks';
import {
  sortByIssuanceDate,
  getCredentialTimestamp,
  useCredentials,
  getDIDAddress,
  processCredential,
  doesCredentialExist,
  generateAuthVC,
} from './credentials';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';

const mockCreds = [
  {
    id: 1,
    issuanceDate: '2022-03-25T10:28:18.848Z',
  },
  {
    id: 0,
    issuanceDate: '2023-03-25T10:28:18.848Z',
  },
  {
    id: 2,
    issuanceDate: '2020-03-25T10:28:18.848Z',
  },
  {
    id: 3,
    issuanceDate: null,
  },
];
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

  describe('getCredentialTimestamp', () => {
    it('expect to get credential timestamp', () => {
      expect(
        getCredentialTimestamp({
          issuanceDate: '2022-03-25T10:28:18.848Z',
        }),
      ).toEqual(1648204098848);
    });

    it('expect handle invalid issuanceDate', () => {
      expect(
        getCredentialTimestamp({
          issuanceDate: 'invalid date',
        }),
      ).toEqual(0);

      expect(
        getCredentialTimestamp({
          issuanceDate: null,
        }),
      ).toEqual(0);
    });

    it('expect throw for invalid credential', () => {
      expect(() => getCredentialTimestamp(null)).toThrowError();
    });
  });

  describe('sortByIssuanceDate', () => {
    it('expect to sort credentials', () => {
      const result = mockCreds
        .map(cred => ({...cred, content: cred}))
        .sort(sortByIssuanceDate);

      result.forEach((item, idx) => expect(item.id).toEqual(idx));
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
      const result = await processCredential({content: credential});
      expect(result.content.issuanceDate.getDate()).toBe(24);
      expect(result.content.issuanceDate.getMonth()).toBe(3);
    });

    it('expect to handle bad data', async () => {
      await expect(processCredential({})).rejects.toThrowError();

      await expect(processCredential(null)).rejects.toThrowError();
    });
  });

  describe('useCredentials', () => {
    const creds = [...mockCreds];
    let hook;
    const onPickFile = jest.fn().mockResolvedValue({});

    beforeEach(async () => {
      jest.spyOn(creds, 'sort');
      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementation(() => Promise.resolve(creds));
      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementation(value => Promise.resolve(value));
      jest
        .spyOn(Credentials.getInstance(), 'remove')
        .mockImplementation(() => Promise.resolve(creds[0]));
      const {result} = await renderHook(() => useCredentials({onPickFile}));
      hook = result;
    });

    it('expect to fetch credentials', () => {
      expect(Credentials.getInstance().query).toBeCalled();
    });

    it('expect to sort credentials', () => {
      expect(creds.sort).toBeCalled();
    });

    it('expect to delete credential', async () => {
      await act(() => {
        hook.current.handleRemove({id: 1});
      });

      expect(Credentials.getInstance().remove).toBeCalledWith(1);
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

    it('expect to add valid credential', async () => {
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
      await result.current.onAdd();

      expect(Credentials.getInstance().add).toBeCalled();
      expect(Credentials.getInstance().query).toBeCalled();
    });

    it('expect not to add duplicated credential', () => {
      const allCredentials = mockCreds.map(m => {
        return {
          content: m,
        };
      });
      expect(doesCredentialExist(allCredentials, mockCreds[0])).toBeTruthy();
      expect(
        doesCredentialExist(allCredentials, {
          id: '10a2ed6eae550f6e1b456777de5ed27fdadd2e6ef1f6081e981918735e1d8f92',
        }),
      ).toBeFalsy();
    });
  });
});
