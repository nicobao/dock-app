import React from 'react';
import {Box, Pressable, Stack} from 'native-base';
import {
  DocumentDownloadIcon,
  PlusCircleIcon,
  OptionList,
  Theme,
  MenuScanQRIcon,
} from 'src/design-system';
import {translate} from '../../locales';
import {BackIcon, Typography} from '../../design-system';

export function ImportExistingAccount({onSelect, onClose, onBack}) {
  return (
    <Stack p={8}>
      <Stack direction="row">
        <Pressable
          onPress={onBack}
          _pressed={{
            opacity: Theme.touchOpacity,
          }}>
          <Box pt={1} pr={5}>
            <BackIcon />
          </Box>
        </Pressable>
        <Typography variant="h1">
          {translate('import_account_modal.title')}
        </Typography>
      </Stack>
      <OptionList
        mt={5}
        postPress={onClose}
        items={[
          {
            title: translate('import_account_modal.recovery_phrase_option'),
            icon: (
              <PlusCircleIcon
                style={{
                  color: Theme.colors.secondaryIconColor,
                }}
              />
            ),
            onPress: () => onSelect('mnemonic'),
          },
          {
            title: translate('import_account_modal.upload_json_option'),
            icon: (
              <DocumentDownloadIcon
                style={{
                  color: Theme.colors.secondaryIconColor,
                }}
              />
            ),
            onPress: () => onSelect('json'),
          },
          {
            title: translate('import_account_modal.scan_qr_code_option'),
            icon: (
              <MenuScanQRIcon
                style={{
                  color: Theme.colors.secondaryIconColor,
                }}
              />
            ),
            onPress: () => onSelect('qrcode'),
          },
        ]}
      />
    </Stack>
  );
}
