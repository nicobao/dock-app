import React, {useEffect, useState} from 'react';
import {Button, Modal, Stack, Text, HStack} from 'native-base';
import {AlertModalIcon, InfoModalIcon, Theme} from 'src/design-system';

let globalController;

export function showConfirmationModal(configs) {
  globalController.setVisible(false);
  globalController.setConfigs(configs);
  globalController.setVisible(true);
}

export function ConfirmationModal() {
  const [visible, setVisible] = useState(false);
  const [configs, setConfigs] = useState({});

  const handleCancel = () => {
    setVisible(false);

    if (configs.onCancel) {
      configs.onCancel();
    }
  };

  const handleConfirm = () => {
    setVisible(false);

    if (configs.onConfirm) {
      configs.onConfirm();
    }
  };

  useEffect(() => {
    globalController = {
      setVisible,
      setConfigs,
    };
  }, []);

  return (
    <Modal
      backgroundColor={Theme.colors.backdrop}
      isOpen={visible}
      onClose={handleCancel}>
      <Modal.Content
        backgroundColor={Theme.colors.modalBackground}
        px={5}
        py={7}>
        <Stack alignItems="center">
          <Stack
            borderRadius={50}
            backgroundColor={Theme.colors.info}
            width={44}
            height={44}
            justifyContent="center"
            alignItems="center">
            {configs.type === 'info' ? <InfoModalIcon /> : <AlertModalIcon />}
          </Stack>
          <Text
            mt={4}
            fontSize={20}
            fontWeight={600}
            fontFamily={Theme.fontFamily.montserrat}>
            {configs.title}
          </Text>
          <Text mt={4} fontSize={14} fontWeight={400}>
            {configs.description}
          </Text>

          <HStack>
            <Button
              mt={2}
              mx={1}
              size="sm"
              width="45%"
              onPress={handleConfirm}
              bg={Theme.colors.info2}>
              {configs.confirmText}
            </Button>
            <Button
              mx={1}
              mt={2}
              size="sm"
              width="45%"
              onPress={handleCancel}
              bg={Theme.colors.tertiaryBackground}>
              {configs.cancelText}
            </Button>
          </HStack>
        </Stack>
      </Modal.Content>
    </Modal>
  );
}
