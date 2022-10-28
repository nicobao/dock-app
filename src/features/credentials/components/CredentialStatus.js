import {NBox, Typography} from '../../../design-system';
import {HStack} from 'native-base';
import React from 'react';

import {useGetCredentialStatus} from '../hooks/credentialHooks';

export function CredentialStatus({credential}) {
  const {statusData} = useGetCredentialStatus({credential});

  return (
    <HStack ml={3}>
      <NBox mt={0.5}>{statusData.icon}</NBox>
      <Typography
        color={statusData.color}
        ml={1}
        variant={'credentialIssuanceDate'}>
        {statusData.message}
      </Typography>
    </HStack>
  );
}
