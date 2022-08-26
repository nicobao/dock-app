import {renderHook, act} from '@testing-library/react-hooks';
import {useDeepLink} from './deepLinkHooks';
import {Routes} from '../routes';
import {navigate} from '../navigation';

describe('Deep hooks', () => {
  it('should navigate to presentation screen', () => {
    const {result} = renderHook(() => useDeepLink({isLoggedIn: true}));
    act(() => {
      result.current.gotoScreenDeepLink({
        url: 'dockwallet://proof-request?url=https&nonce=1',
      });
    });

    expect(navigate).toBeCalledWith(Routes.CREDENTIALS_SHARE_AS_PRESENTATION, {
      deepLinkUrl: 'dockwallet://proof-request?url=https&nonce=1',
    });
  });
});
