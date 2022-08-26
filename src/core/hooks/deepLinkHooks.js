import {useCallback, useMemo} from 'react';
import {
  isDidAuthUrl,
  isDeepLinkType,
} from '../../features/qr-code-scanner/qr-code';
import {Routes} from '../routes';
import {navigate} from '../navigation';

export function useDeepLink({isLoggedIn}) {
  const navigateToDeepLinkScreen = useCallback(
    (route, params = {}) => {
      if (isLoggedIn) {
        navigate(route, params);
      } else {
        navigate(Routes.UNLOCK_WALLET, {
          callback: () => {
            navigate(route, params);
          },
        });
      }
    },
    [isLoggedIn],
  );

  const gotoScreenDeepLink = useCallback(
    ({url}) => {
      if (isDidAuthUrl(url)) {
        navigateToDeepLinkScreen(Routes.APP_DID_AUTH, {
          dockWalletAuthDeepLink: url,
        });
      } else if (isDeepLinkType(url, 'dockwallet://proof-request?url=')) {
        navigateToDeepLinkScreen(Routes.CREDENTIALS_SHARE_AS_PRESENTATION, {
          deepLinkUrl: url,
        });
      }
    },
    [navigateToDeepLinkScreen],
  );

  return useMemo(() => {
    return {
      gotoScreenDeepLink,
    };
  }, [gotoScreenDeepLink]);
}
