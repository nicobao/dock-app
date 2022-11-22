import {Box, Stack} from 'native-base';
import React from 'react';
import {Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Modal} from '../../components/Modal';
import {DockLogoIcon, Typography, Theme, Button} from '../../design-system';
import {translate} from '../../locales';

export function QRCodeModal({onClose, visible, data, title, description}) {
  const windowWidth = Dimensions.get('window').width;

  return (
    <Modal visible={visible} onClose={onClose} modalSize={0.95}>
      <Stack p={8}>
        <Typography variant="h1">{title}</Typography>
        <Typography>{description}</Typography>
        <Box
          mt={8}
          alignItems="center"
          p={3}
          bg={Theme.colors.qrCodeBackground}>
          {data && (
            <QRCode value={data} logo={DockLogoIcon} size={windowWidth * 0.8} />
          )}
        </Box>
        <Stack mt={5}>
          <Button variant="solid" size="sm" onPress={onClose}>
            {translate('navigation.close')}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
