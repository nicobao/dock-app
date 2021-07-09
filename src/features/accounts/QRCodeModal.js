import React from 'react';
import {Box, Stack} from 'native-base';
import QRCode from 'react-native-qrcode-svg'
import {
  Text,
} from 'src/design-system';
import {Modal} from '../../components/Modal';
import { DockLogoIcon } from '../../design-system';
import { Dimensions } from 'react-native';

export function QRCodeModal({onClose, visible, data, title, description }) {
  const qrSize = Dimensions.get('window').width * 0.8;

  return (
    <Modal visible={visible} onClose={onClose} modalSize={0.6}>
      <Stack p={8}>
        <Text
          fontSize="24px"
          fontWeight={600}
          color="#fff"
          fontFamily="Montserrat">
          {title}
        </Text>
        <Text color="#D4D4D8">
          {description}
        </Text>
        <Box mt={8} alignItems="center" height={qrSize}>
          <QRCode
            value={data}
            logo={DockLogoIcon}
            size={qrSize}
          />
        </Box>
      </Stack>      
    </Modal>
  );
}
