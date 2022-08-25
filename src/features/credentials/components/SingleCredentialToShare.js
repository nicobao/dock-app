import React from 'react';
import {HStack, Image, Text, VStack, Checkbox} from 'native-base';
import {NBox, Theme, Typography} from '../../../design-system';
import {View} from 'react-native';
import {PolkadotIcon} from '../../../components/PolkadotIcon';
import {getDIDAddress} from '../credentials';
import {formatDate} from '@docknetwork/wallet-sdk-core/lib/core/format-utils';

export function SingleCredentialToShare() {
  return (
    <NBox
      my={3}
      py={3}
      pl={4}
      pr={3}
      style={{
        backgroundColor: Theme.colors.grey,
        borderRadius: 12,
      }}>
      <VStack>
        <HStack>
          <Typography
            style={{
              flexGrow: 1,
            }}
            numberOfLines={1}
            pt={2}
            variant="credentialShareTitle">
            Software Engineer SDE III
          </Typography>
          <Checkbox pt={2} mr={1} />
        </HStack>
        <Typography
          mb={30}
          style={{
            flexGrow: 1,
          }}
          numberOfLines={1}
          pt={2}
          variant="credentialShareSubjects">
          Amazon
        </Typography>
        <NBox mt={4} flexDirection="row" alignItems={'flex-end'}>
          <NBox>
            <Text
              fontSize={'11px'}
              fontWeight={500}
              fontFamily={Theme.fontFamily.default}>
              {formatDate('2022-06-27T12:08:30.675Z')}
            </Text>
          </NBox>
          <NBox flex={1} alignItems={'flex-end'} />
        </NBox>
      </VStack>
    </NBox>
  );
}
