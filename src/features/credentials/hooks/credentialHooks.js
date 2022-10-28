import React, {useEffect, useMemo, useState} from 'react';
import {CREDENTIAL_STATUS, isCredentialValid} from '../credentials';
import {translate} from '../../../locales';
import {
  ExpiredIcon,
  InvalidIcon,
  RevokeIcon,
  VerifiedIcon,
} from '../../../assets/icons';
import {Theme} from '../../../design-system';

export function useGetCredentialStatus({credential}) {
  const [status, setStatus] = useState(CREDENTIAL_STATUS.VERIFIED);

  const statusData = useMemo(() => {
    switch (status) {
      case CREDENTIAL_STATUS.INVALID:
        return {
          message: translate('credentials.invalid'),
          icon: <InvalidIcon />,
          color: Theme.colors.errorText,
        };
      case CREDENTIAL_STATUS.EXPIRED:
        return {
          message: translate('credentials.expired'),
          icon: <ExpiredIcon />,
          color: Theme.colors.warningText,
        };
      case CREDENTIAL_STATUS.REVOKED:
        return {
          message: translate('credentials.revoked'),
          icon: <RevokeIcon />,
          color: Theme.colors.errorText,
        };
      default:
        return {
          message: translate('credentials.valid'),
          icon: <VerifiedIcon />,
          color: Theme.colors.circleChecked,
        };
    }
  }, [status]);

  useEffect(() => {
    console.log(credential, 'credential');
    isCredentialValid(credential).then(response => {
      setStatus(response.status);
    });
  }, [credential]);

  return useMemo(() => {
    return {
      status,
      statusData,
    };
  }, [status, statusData]);
}
