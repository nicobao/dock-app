import React from 'react';
import {Dimensions, View} from 'react-native';
import RNModal from 'react-native-modal';

export function Modal({onClose = () => {}, children, modalSize = 0.7, visible}) {
  const screenHeight = Dimensions.get('screen').height;

  return (
    <RNModal
      isVisible={visible}
      onSwipeComplete={() => onClose(null)}
      swipeDirection={['down']}
      onBackdropPress={() => onClose(null)}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View
        style={{
          backgroundColor: '#fff',
          height: screenHeight * modalSize,
          width: '100%',
        }}>
        {children}
      </View>
    </RNModal>
  );
}
