import {Modal} from '../../../components/Modal';
import React from 'react';
import {translate} from '../../../locales';
import {LoadingButton, NBox, Typography} from '../../../design-system';
import {VStack} from 'native-base';
import {addTestId} from '../../../core/automation-utils';
import {AmountDetails} from '../../tokens/ConfirmTransactionModal';

export function CreateDIDDockConfirmationModal({
  didName,
  didType,
  onCreateDID,
  visible,
  onClose,
}) {
  const didTypeMap = {
    diddock: 'did:dock',
    didkey: 'did:key',
  };
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      onBackButtonPress={onClose}
      modalSize={0.8}>
      <VStack p={7}>
        <Typography variant="h1" mb={4}>
          {translate('confirm_transaction.title')}
        </Typography>
        <NBox mt={5}>
          <Typography variant={'didModalInfoTitle'} mb={1}>
            {translate('didManagement.did_name')}
          </Typography>
          <Typography variant={'description'} mb={1}>
            {didName}
          </Typography>
        </NBox>

        <NBox mt={5}>
          <Typography variant={'didModalInfoTitle'} mb={1}>
            {translate('didManagement.did_type')}
          </Typography>
          <Typography variant={'description'} mb={1}>
            {didTypeMap[didType]}
          </Typography>
        </NBox>
        <NBox mt={5}>
          <Typography variant={'didModalInfoTitle'} mb={1}>
            {translate('confirm_transaction.fee')}
          </Typography>
          <AmountDetails amount={1} symbol={'DOCK'} />
        </NBox>
        <NBox mt={5}>
          <Typography variant={'didModalInfoTitle'} mb={1}>
            {translate('confirm_transaction.total')}
          </Typography>
          <AmountDetails amount={1} symbol={'DOCK'} />
        </NBox>
        <LoadingButton
          mt={12}
          full
          {...addTestId('CreateNewDIDScreenDIDCreate')}
          onPress={onCreateDID}>
          {translate('confirm_transaction.title')}
        </LoadingButton>
      </VStack>
    </Modal>
  );
}
