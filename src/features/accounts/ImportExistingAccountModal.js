import React from 'react';
import {Stack} from 'native-base';
import {
  DocumentDownloadIcon,
  PlusCircleIcon,
  Text,
  OptionList,
} from 'src/design-system';
import {Modal} from '../../components/Modal';

export function ImportExistingAccountModal({onClose, visible, onImportExistingAccount}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Stack p={8}>
        <Text
          fontSize="24px"
          fontWeight={600}
          color="#fff"
          fontFamily="Montserrat">
          Import via
        </Text>
        <OptionList
          mt={5}
          items={[
            {
              title: 'Account recovery phrase',
              icon: <PlusCircleIcon />,
              onPress: () => onImportExistingAccount('mnemonic'),
            },
            {
              title: 'Upload JSON file',
              icon: <DocumentDownloadIcon />,
              onPress: () => onImportExistingAccount('json'),
            },
            {
              title: 'Scan QR code',
              icon: <DocumentDownloadIcon />,
              onPress: () => onImportExistingAccount('qrcode'),
            },
          ]}
        />
      </Stack>
    </Modal>
  );
}
