import {
  Button,
  DotsVerticalIcon,
  IconButton,
  NBox,
  Theme,
  Typography,
} from '../../../design-system';
import {HStack, VStack} from 'native-base';
import {addTestId} from '../../../core/automation-utils';
import {translate} from '../../../locales';
import React from 'react';

export function DIDListItem({didDocumentResolution, onOptionClicked, onShare}) {
  const {didDocument} = didDocumentResolution;
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
            variant="didTitle">
            {didDocumentResolution.name}
          </Typography>
          <IconButton
            col
            {...addTestId('DIDListItemOptionButton')}
            onPress={onOptionClicked}>
            <DotsVerticalIcon />
          </IconButton>
        </HStack>
        <HStack>
          <Typography numberOfLines={1} mb={7} pt={2} variant="didDescription">
            {didDocument.id}
          </Typography>
        </HStack>
        <Button
          width="30%"
          size="xs"
          variant={'whiteButton'}
          colorScheme="dark"
          {...addTestId('Share')}
          onPress={onShare}>
          <Typography color={Theme.colors.primaryBackground}>
            {translate('didManagement.share')}
          </Typography>
        </Button>
      </VStack>
    </NBox>
  );
}
