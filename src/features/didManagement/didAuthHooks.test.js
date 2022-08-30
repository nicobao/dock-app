import {useWallet} from '@docknetwork/wallet-sdk-react-native/lib';
import {renderHook, act} from '@testing-library/react-hooks';
import {
  DID_AUTH_METADATA_ID,
  useDIDAuth,
  useDIDAuthHandlers,
} from './didAuthHooks';

describe('DID auth hooks', () => {
  it('Parse DID list for select dropdown', () => {
    const {result} = renderHook(() => useDIDAuth());
    expect(result.current.dids[0]).toHaveProperty('description');
    expect(result.current.dids[0]).toHaveProperty('value');
    expect(result.current.dids[0]).toHaveProperty('label');
  });
  it('retry failed authentication', () => {
    const {result} = renderHook(() => useDIDAuth());

    act(() => {
      result.current.handleRetry();
    });
    expect(result.current.authState).toBe('start');
  });

  it('expect to upsert did auth metadata document', async () => {
    const {wallet} = useWallet();
    const {result} = renderHook(() => useDIDAuth());

    act(() => {
      result.current.authenticateDID({
        dockWalletAuthDeepLink: null,
        selectedDID: null,
        profileData: {},
      });
    });

    expect(wallet.upsert).toBeCalled();
  });
});

describe('DID auth handlers', () => {
  it('set profile data', () => {
    const {result} = renderHook(() => useDIDAuthHandlers());
    act(() => {
      result.current.handleChange('name', 'JOHN');
    });
    expect(result.current.profileData).toHaveProperty('name', 'JOHN');
    act(() => {
      result.current.handleChange('did', 'did:key');
    });

    expect(result.current.profileData.did).toBeUndefined();
    expect(result.current.selectedDID).toBe('did:key');
  });

  it('expect to update profile data', async () => {
    const {result} = await renderHook(() => useDIDAuthHandlers());

    await act(() => {
      result.current.handleChange('name', 'test');
    });

    expect(result.current.profileData.empty).toBeUndefined();
    expect(result.current.profileData.name).toBe('test');
  });

  it('expect to fetch did auth metadata documents', async () => {
    const {wallet} = useWallet();
    const profileData = {
      name: 'Test',
      email: 'test@test.com',
    };

    await wallet.upsert({
      id: DID_AUTH_METADATA_ID,
      type: 'Metadata',
      value: profileData,
    });

    const {result} = await renderHook(() => useDIDAuthHandlers());

    expect(wallet.getDocumentById).toBeCalledWith(DID_AUTH_METADATA_ID);
    expect(result.current.profileData).toStrictEqual(profileData);
  });
});
