import React from 'react';
import {
  HStack,
  Image,
  Text,
  VStack,
  Checkbox,
  Stack,
  Menu,
  Pressable,
} from 'native-base';
import {
  DotsVerticalIcon,
  NBox,
  Theme,
  Typography,
} from '../../../design-system';
import {View} from 'react-native';
import {PolkadotIcon} from '../../../components/PolkadotIcon';
import {getDIDAddress} from '../credentials';
import {formatDate} from '@docknetwork/wallet-sdk-core/lib/core/format-utils';
import {withErrorBoundary} from '../../../core/error-handler';
import {translate} from '../../../locales';
import {renderObjectAttributes} from '../CredentialsScreen';

export const SingleCredentialToShare = withErrorBoundary(
  ({rawCredential, formattedData, isChecked, onSelect}) => {
    const {title = translate('credentials.default_title')} = formattedData;
    const credential = rawCredential.content;
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
              mb={7}
              variant="credentialShareTitle">
              {title}
            </Typography>
            <Checkbox
              isChecked={isChecked}
              pt={2}
              mr={1}
              onChange={onSelect}
              accessibilityLabel="Select credential"
            />
          </HStack>
          {renderObjectAttributes(formattedData)}

          <NBox mt={4} flexDirection="row" alignItems={'flex-end'}>
            <NBox>
              <Text
                fontSize={'11px'}
                fontWeight={500}
                fontFamily={Theme.fontFamily.montserrat}>
                {formatDate(credential.issuanceDate)}
              </Text>
            </NBox>
            <NBox flex={1} alignItems={'flex-end'}>
              {formattedData.image ? (
                <View
                  style={{
                    width: 50,
                    height: 50,
                  }}>
                  <Image
                    borderRadius={8}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                    alt={title}
                    source={{
                      uri: formattedData.image,
                    }}
                  />
                </View>
              ) : (
                <PolkadotIcon
                  address={getDIDAddress(credential.issuer.id)}
                  size={32}
                />
              )}
            </NBox>
          </NBox>
        </VStack>
      </NBox>
    );
  },
);
