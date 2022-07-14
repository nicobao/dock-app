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

export function DIDListItem({didDocumentResolution, onOptionClicked}) {
  const {didDocument} = didDocumentResolution;
  return (
    <NBox
      my={3}
      py={3}
      pl={4}
      pr={10}
      style={{
        backgroundColor: Theme.colors.grey,
        borderRadius: 12,
      }}>
      <VStack>
        <HStack>
          <Typography numberOfLines={1} mb={7} pt={2} variant="didDescription">
            {didDocument.id}
          </Typography>
          <NBox>
            <IconButton
              col
              {...addTestId('DIDListItemOptionButton')}
              onPress={onOptionClicked}>
              <DotsVerticalIcon />
            </IconButton>
          </NBox>
        </HStack>
        <Button
          width="30%"
          size="sm"
          variant={'whiteButton'}
          colorScheme="dark"
          {...addTestId('Share')}
          onPress={() => {}}>
          <Typography color={Theme.colors.primaryBackground}>
            {translate('didManagement.share')}
          </Typography>
        </Button>
      </VStack>
    </NBox>
  );
}
