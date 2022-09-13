import {renderHook, act} from '@testing-library/react-hooks';
import {useCredentialPresentation} from './credentialPresentation';
import {usePresentation} from '@docknetwork/wallet-sdk-react-native/lib';
import {useSingleDID} from '../../didManagement/didHooks';

describe('Presentation hooks', () => {
  it('go to next step', () => {
    const {result} = renderHook(() =>
      useCredentialPresentation({
        deepLinkUrl: 'dockwallet://proof-request?url=https&nonce=1',
      }),
    );
    act(() => {
      result.current.onNext();
    });
    expect(result.current.step).toBe(1);
  });
  it('Is form valid', () => {
    const {result} = renderHook(() =>
      useCredentialPresentation({
        deepLinkUrl: 'dockwallet://proof-request?url=https&nonce=1',
      }),
    );
    expect(result.current.isFormValid).toBe(false);
    act(() => {
      result.current.setSelectedCredentials({1: {}});
    });
    expect(result.current.isFormValid).toBe(true);
    act(() => {
      result.current.onNext();
    });
    expect(result.current.isFormValid).toBe(false);
    act(() => {
      result.current.onSelectDID({});
    });
    expect(result.current.isFormValid).toBe(true);
  });
  it('on present credential', async () => {
    const {result: presentationResult} = renderHook(() => usePresentation());
    const {result} = renderHook(() =>
      useCredentialPresentation({
        deepLinkUrl: 'dockwallet://proof-request?url=https&nonce=1',
      }),
    );
    await result.current.onPresentCredentials();
    expect(presentationResult.current.presentCredentials).toBeCalledWith({
      challenge: '1',
      credentials: [],
      id: 'dockwallet://proof-request?url=https&nonce=1',
      keyDoc: {
        '@context': ['https://w3id.org/wallet/v1'],
        controller: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
        correlation: ['1654905466848'],
        description: 'For testing only, totally compromised.',
        id: 'urn:uuid:e8fc7810-9524-11ea-bb37-0242ac130002',
        image: 'https://via.placeholder.com/150',
        name: 'My Test Key 2',
        privateKeyBase58:
          '3CQCBKF3Mf1tU5q1FLpHpbxYrNYxLiZk4adDtfyPEfc39Wk6gsTb2qoc1ZtpqzJYdM1rG4gpaD3ZVKdkiDrkLF1p',
        publicKeyBase58: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
        tags: ['professional', 'organization', 'compromised'],
        type: 'Ed25519VerificationKey2018',
      },
    });
  });
  it('handle errors in presentation', async () => {
    const {result} = renderHook(() =>
      useCredentialPresentation('dockwallet://proof-request?url=https&nonce=2'),
    );
    await expect(result.current.onPresentCredentials()).rejects.toThrow();
  });
  it('select did if only one exist', () => {
    const dids = [{value: 1}];
    const onSelectDID = jest.fn();
    renderHook(() => useSingleDID(dids, onSelectDID));
    expect(onSelectDID).toBeCalledWith(1);
  });
  it('don"t select did if more than one exist', () => {
    const dids = [{value: 1}, {value: 2}];
    const onSelectDID = jest.fn();
    renderHook(() => useSingleDID(dids, onSelectDID));
    expect(onSelectDID).not.toBeCalled();
  });
  it('go to next step when multiple dids', () => {
    const dids = [{value: 1}, {value: 2}];
    const {result} = renderHook(() =>
      useCredentialPresentation('dockwallet://proof-request?url=https&nonce=1'),
    );
    act(() => {
      result.current.onNext(dids);
    });
    expect(result.current.step).toBe(1);
  });
  it('proceed should create presentation when there is single did', async () => {
    const dids = [{value: 1}];
    const {result} = renderHook(() =>
      useCredentialPresentation('dockwallet://proof-request?url=https&nonce=1'),
    );
    const {result: presentationResult} = renderHook(() => usePresentation());
    await result.current.onNext(dids);
    expect(presentationResult.current.presentCredentials).toBeCalledWith({
      challenge: '1',
      credentials: [],
      id: 'dockwallet://proof-request?url=https&nonce=1',
      keyDoc: {
        '@context': ['https://w3id.org/wallet/v1'],
        controller: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
        correlation: ['1654905466848'],
        description: 'For testing only, totally compromised.',
        id: 'urn:uuid:e8fc7810-9524-11ea-bb37-0242ac130002',
        image: 'https://via.placeholder.com/150',
        name: 'My Test Key 2',
        privateKeyBase58:
          '3CQCBKF3Mf1tU5q1FLpHpbxYrNYxLiZk4adDtfyPEfc39Wk6gsTb2qoc1ZtpqzJYdM1rG4gpaD3ZVKdkiDrkLF1p',
        publicKeyBase58: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
        tags: ['professional', 'organization', 'compromised'],
        type: 'Ed25519VerificationKey2018',
      },
    });
  });
});
