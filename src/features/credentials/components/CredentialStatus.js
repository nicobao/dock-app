import {NBox, Typography} from '../../../design-system';
import {HStack} from 'native-base';
import React from 'react';
import {credentialStatusData} from '../credentials';
import {useGetCredentialStatus} from '@docknetwork/wallet-sdk-react-native/lib';

export function CredentialStatus({credential}) {
  const status = useGetCredentialStatus({credential});

  return (
    <HStack ml={3}>
      <NBox mt={0.5}>{credentialStatusData[status].icon}</NBox>
      <Typography
        color={credentialStatusData[status].color}
        ml={1}
        variant={'credentialIssuanceDate'}>
        {credentialStatusData[status].message}
      </Typography>
    </HStack>
  );
}
