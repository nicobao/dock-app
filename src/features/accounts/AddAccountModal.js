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
import {AddAccountModalTestIDs} from './test-ids';

export function AddAccountModal({
  onClose,
  visible,
  onAddAccount,
  onImportExistingAccount,
}) {
  const [importExisting, setImportExisting] = useState();

  useEffect(() => {
    setImportExisting(false);
  }, [visible])

  const content = !importExisting ? (
    <Stack p={8} testID="addAccountModal">
      <Text
        fontSize="24px"
        fontWeight={600}
        color="#fff"
        fontFamily="Montserrat">
        Add Account
      </Text>
      <OptionList
        mt={5}
        items={[
          {
            testID: AddAccountModalTestIDs.addAccountOption,
            title: 'Create new account',
            icon: <PlusCircleIcon />,
            onPress: () => {
              onAddAccount();
              onClose();
            },
          },
          {
            testID: AddAccountModalTestIDs.importExistingOption,
            title: 'Import existing account',
            icon: <DocumentDownloadIcon />,
            onPress: () => setImportExisting(true),
          },
        ]}
      />
    </Stack>
  ) : (
    <Stack p={8} testID="importOptionsModal">
      <Stack direction="row">
        <Pressable onPress={() => setImportExisting(false)}>
          <Box pt={1} pr={5}>
            <BackIcon />
          </Box>
        </Pressable>
        <Text
          fontSize="24px"
          fontWeight={600}
          color="#fff"
          fontFamily="Montserrat">
          Import via
        </Text>
      </Stack>
      <OptionList
        mt={5}
        postPress={onClose}
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
  );
  return <Modal visible={visible} onClose={onClose}>{content}</Modal>;
}
