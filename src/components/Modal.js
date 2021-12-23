import {Box, Stack} from 'native-base';
import React from 'react';
import {Dimensions, View} from 'react-native';
import RNModal from 'react-native-modal';
import {Theme} from '../design-system';

export function Modal({
  onClose = () => {},
  onBackButtonPress,
  children,
  modalSize = 0.5,
  visible,
}) {
  const screenHeight = Dimensions.get('window').height;

  return (
    <RNModal
      isVisible={visible}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      onBackdropPress={onClose}
      onBackButtonPress={onBackButtonPress || onClose}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View
        style={{
          backgroundColor: Theme.colors.modalBackground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: screenHeight * modalSize,
          width: '100%',
        }}>
        <Stack alignItems="center" mt={6}>
          <Box
            width="36px"
            height="4px"
            backgroundColor={Theme.colors.tertiaryBackground}
            borderRadius={Theme.borderRadius}
          />
        </Stack>
        {children}
      </View>
    </RNModal>
  );
}
