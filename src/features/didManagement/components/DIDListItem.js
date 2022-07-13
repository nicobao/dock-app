import {
  Button,
  DotsVerticalIcon,
  NBox,
  Theme,
  Typography,
} from '../../../design-system';
import {HStack, Menu, Pressable, VStack} from 'native-base';
import {addTestId} from '../../../core/automation-utils';
import {translate} from '../../../locales';
import React from 'react';

export function DIDListItem({didDocument}) {
  return (
    <NBox
      mt={3}
      mb={3}
      px={7}
      py={5}
      style={{
        backgroundColor: Theme.colors.grey,
        borderRadius: 12,
      }}>
      <VStack>
        <HStack>
          <Typography numberOfLines={1} mb={7} variant="didDescription">
            {didDocument.id}
          </Typography>
          <NBox py={1} px={1}>
            <Menu
              trigger={triggerProps => {
                return (
                  <Pressable
                    {...triggerProps}
                    _pressed={{
                      opacity: Theme.touchOpacity,
                    }}>
                    <DotsVerticalIcon />
                  </Pressable>
                );
              }}>
              <Menu.Item onPress={null}>
                {translate('account_list.delete_account')}
              </Menu.Item>
            </Menu>
          </NBox>
        </HStack>
        <Button
          width="30%"
          size="sm"
          variant={'whiteButton'}
          colorScheme="dark"
          {...addTestId('Share')}
          onPress={null}>
          <Typography color={Theme.colors.primaryBackground}>
            {translate('didManagement.share')}
          </Typography>
        </Button>
      </VStack>
    </NBox>
  );
}
