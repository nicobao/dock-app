import {Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  DocumentDownloadIcon,
  OptionList,
  PlusCircleIcon,
} from 'src/design-system';
import {translate} from 'src/locales';
import {Modal} from '../../components/Modal';
import {Typography} from '../../design-system';
import {ImportExistingAccount} from './ImportExistingAccount';
import {AddAccountModalTestIDs} from './test-ids';

export function AddAccountModal({
  onClose,
  visible,
  onAddAccount,
  onImportExistingAccount,
  showImportAccount,
}) {
  const [importExisting, setImportExisting] = useState(showImportAccount);

  useEffect(() => {
    setImportExisting(showImportAccount);
  }, [visible, showImportAccount]);

  const content = !importExisting ? (
    <Stack p={8} testID="addAccountModal">
      <Typography variant="h1">
        {translate('add_account_modal.title')}
      </Typography>
      <OptionList
        mt={5}
        items={[
          {
            testID: AddAccountModalTestIDs.addAccountOption,
            title: translate('add_account_modal.create_new'),
            icon: <PlusCircleIcon />,
            onPress: () => {
              onAddAccount();
              onClose();
            },
          },
          {
            testID: AddAccountModalTestIDs.importExistingOption,
            title: translate('add_account_modal.import_existing'),
            icon: <DocumentDownloadIcon />,
            onPress: () => setImportExisting(true),
          },
        ]}
      />
    </Stack>
  ) : (
    <ImportExistingAccount
      onClose={onClose}
      onSelect={onImportExistingAccount}
      onBack={() => setImportExisting(false)}
    />
  );
  return (
    <Modal visible={visible} onClose={onClose}>
      {content}
    </Modal>
  );
}
