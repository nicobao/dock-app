import {Box, Pressable, Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  BackIcon,
  DocumentDownloadIcon,
  OptionList,
  PlusCircleIcon,
  Theme,
} from 'src/design-system';
import {Modal} from '../../components/Modal';
import {Typography} from '../../design-system';
import {translate} from '../../locales';

export function AccountSettingsModal({
  onClose,
  visible,
  onDelete,
  onExport,
  account,
}) {
  const [view, setView] = useState('options');

  useEffect(() => {
    setView('options');
  }, [visible]);

  const content =
    view === 'options' ? (
      <Stack p={8}>
        <Typography variant="h1">
          {translate('account_settings_modal.options_title')}
        </Typography>
        <OptionList
          mt={5}
          items={[
            account.readOnly
              ? null
              : {
                  title: 'Export account',
                  icon: (
                    <PlusCircleIcon
                      style={{
                        color: Theme.colors.secondaryIconColor,
                      }}
                    />
                  ),
                  onPress: () => setView('export'),
                },
            {
              title: 'Delete account',
              icon: (
                <DocumentDownloadIcon
                  style={{
                    color: Theme.colors.secondaryIconColor,
                  }}
                />
              ),
              onPress: () => {
                onDelete();
                onClose();
              },
            },
          ].filter(opt => !!opt)}
        />
      </Stack>
    ) : (
      <Stack p={8}>
        <Stack direction="row">
          <Pressable onPress={() => setView('options')}>
            <Box pt={1} pr={5}>
              <BackIcon
                style={{
                  color: Theme.colors.secondaryIconColor,
                }}
              />
            </Box>
          </Pressable>
          <Typography variant="h1">
            {translate('account_settings_modal.export_account_title')}
          </Typography>
        </Stack>
        <OptionList
          mt={5}
          postPress={onClose}
          items={[
            {
              title: translate('account_settings_modal.export_via_json'),
              icon: (
                <DocumentDownloadIcon
                  style={{
                    color: Theme.colors.secondaryIconColor,
                  }}
                />
              ),
              onPress: () => onExport('json'),
            },
            {
              title: translate('account_settings_modal.export_via_qrcode'),
              icon: (
                <DocumentDownloadIcon
                  style={{
                    color: Theme.colors.secondaryIconColor,
                  }}
                />
              ),
              onPress: () => onExport('qrcode'),
            },
          ]}
        />
      </Stack>
    );
  return (
    <Modal visible={visible} onClose={onClose}>
      {content}
    </Modal>
  );
}
