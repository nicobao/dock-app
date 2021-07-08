import React, { useEffect, useState } from 'react';
import {Box, Pressable, Stack} from 'native-base';
import {
  DocumentDownloadIcon,
  PlusCircleIcon,
  Text,
  OptionList,
  BackIcon
} from 'src/design-system';
import {Modal} from '../../components/Modal';

export function AccountSettingsModal({
  onClose,
  visible,
  onDelete,
  onExport,
}) {
  const [view, setView] = useState('options');

  useEffect(() => {
    setView('options');
  }, [visible])

  const content = view === 'options' ? (
    <Stack p={8}>
      <Text
        fontSize="24px"
        fontWeight={600}
        color="#fff"
        fontFamily="Montserrat">
        Options
      </Text>
      <OptionList
        mt={5}
        items={[
          {
            title: 'Export account',
            icon: <PlusCircleIcon />,
            onPress: () => setView('export'),
          },
          {
            title: 'Delete account',
            icon: <DocumentDownloadIcon />,
            onPress: () => {
              onDelete()
              onClose();
            },
          },
        ]}
      />
    </Stack>
  ) : (
    <Stack p={8}>
      <Stack direction="row">
        <Pressable onPress={() => setView('options')}>
          <Box pt={1} pr={5}>
            <BackIcon />
          </Box>
        </Pressable>
        <Text
          fontSize="24px"
          fontWeight={600}
          color="#fff"
          fontFamily="Montserrat">
          Export account via
        </Text>
      </Stack>
      <OptionList
        mt={5}
        postPress={onClose}
        items={[
          {
            title: 'JSON',
            icon: <DocumentDownloadIcon />,
            onPress: () => onExport('json'),
          },
          {
            title: 'QR code',
            icon: <DocumentDownloadIcon />,
            onPress: () => onExport('qrcode'),
          },
        ]}
      />
    </Stack>
  );
  return <Modal visible={visible} onClose={onClose}>{content}</Modal>;
}
