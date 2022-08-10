import {renderHook} from '@testing-library/react-hooks';
import {useAccountsList} from './accountsHooks';

describe('Test account hooks', () => {
  test('test accounts reversal', () => {
    const {result} = renderHook(() => useAccountsList());
    expect(result.current.accounts[0].id).toBe('2');
    expect(result.current.accounts[1].id).toBe('1');
  });
});
