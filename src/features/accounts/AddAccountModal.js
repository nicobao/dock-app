import {Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  DocumentDownloadIcon,
  OptionList,
  PlusCircleIcon,
  Theme,
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
  const handleBack = () => {
    if (importExisting) {
      setImportExisting(false);
    } else {
      onClose();
    }
  };

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
            icon: (
              <PlusCircleIcon
                style={{
                  color: Theme.colors.secondaryIconColor,
                }}
              />
            ),
            onPress: () => {
              onAddAccount();
              onClose();
            },
          },
          {
            testID: AddAccountModalTestIDs.importExistingOption,
            title: translate('add_account_modal.import_existing'),
            icon: (
              <DocumentDownloadIcon
                style={{
                  color: Theme.colors.secondaryIconColor,
                }}
              />
            ),
            onPress: () => setImportExisting(true),
          },
        ]}
      />
    </Stack>
  ) : (
    <ImportExistingAccount
      onClose={onClose}
      onSelect={option => {
        onImportExistingAccount(option);
        onClose();
      }}
      onBack={handleBack}
    />
  );
  return (
    <Modal visible={visible} onClose={onClose} onBackButtonPress={handleBack}>
      {content}
    </Modal>
  );
}
