import {Modal} from '../../../components/Modal';
import React from 'react';
import {Stack} from 'native-base';
import {
  DownloadIcon,
  OptionList,
  PlusCircleIcon,
  Typography,
} from '../../../design-system';
import {translate} from '../../../locales';
import {addTestId} from '../../../core/automation-utils';
import {navigate} from '../../../core/navigation';
import {Routes} from '../../../core/routes';

export function NewDIDModal({visible, onClose, onImportDID}) {
  const content = (
    <Stack p={8} testID="addDIDModal">
      <Typography variant="h1">{translate('didManagement.add_did')}</Typography>
      <OptionList
        mt={5}
        items={[
          {
            testID: addTestId('CreateNewDID').testID,
            title: translate('didManagement.create_new_did'),
            icon: <PlusCircleIcon />,
            onPress: () => {
              onClose();
              navigate(Routes.DID_MANAGEMENT_NEW_DID);
            },
          },
          {
            testID: addTestId('ImportExistingDIDBtn').testID,
            title: translate('didManagement.import_existing_did'),
            icon: <DownloadIcon />,
            onPress: onImportDID,
          },
        ]}
      />
    </Stack>
  );
  return (
    <Modal visible={visible} onClose={onClose} onBackButtonPress={onClose}>
      {content}
    </Modal>
  );
}
