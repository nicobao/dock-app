import {renderHook, act} from '@testing-library/react-hooks';
import {useDIDAuth, useDIDAuthHandlers} from './didAuthHooks';

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
});
