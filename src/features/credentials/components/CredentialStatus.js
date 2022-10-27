import {
  Theme,
  Typography,
  VerifiedIcon,
  InvalidIcon,
  ExpiredIcon,
} from '../../../design-system';
import {HStack} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {CREDENTIAL_STATUS, isCredentialValid} from '../credentials';
import {translate} from '../../../locales';

export function CredentialStatus({credential}) {
  const [status, setStatus] = useState(CREDENTIAL_STATUS.VERIFIED);

  useEffect(() => {
    isCredentialValid(credential).then(response => {
      setStatus(response.status);
    });
  }, [credential]);

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
      default:
        return {
          message: translate('credentials.valid'),
          icon: <VerifiedIcon />,
          color: Theme.colors.circleChecked,
        };
    }
  }, [status]);

  return (
    <HStack ml={3}>
      {statusData.icon}
      <Typography
        color={statusData.color}
        ml={1}
        variant={'credentialIssuanceDate'}>
        {statusData.message}
      </Typography>
    </HStack>
  );
}
