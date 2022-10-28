import {renderHook} from '@testing-library/react-hooks';
import {useGetCredentialStatus} from './credentialHooks';

describe('Credential  hooks', () => {
  it('get credential status', async () => {
    const invalidCred = {
      id: 1,
      status: 'invalid',
    };
    const expiredCred = {
      id: 2,
      status: 'expired',
    };
    const revokeCred = {
      id: 3,
      status: 'revoke',
    };
    const validCred = {
      id: 4,
      status: 'valid',
    };

    const {result} = renderHook(() =>
      useGetCredentialStatus({credential: validCred}),
    );
    expect(result.current.statusData.message).toBe('Valid');
  });
});
