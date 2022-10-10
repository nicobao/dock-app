import {renderHook, act} from '@testing-library/react-hooks';
import {useDeepLink} from './deepLinkHooks';
import {Routes} from '../routes';
import {navigate} from '../navigation';

describe('Deep hooks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
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
  it('should navigate to presentation screen when not logged in', () => {
    const {result} = renderHook(() => useDeepLink({isLoggedIn: false}));
    act(() => {
      result.current.gotoScreenDeepLink({
        url: 'dockwallet://proof-request?url=https&nonce=1',
      });
    });

    expect(navigate).not.toBeCalledWith(
      Routes.CREDENTIALS_SHARE_AS_PRESENTATION,
      {
        deepLinkUrl: 'dockwallet://proof-request?url=https&nonce=1',
      },
    );
  });
});
