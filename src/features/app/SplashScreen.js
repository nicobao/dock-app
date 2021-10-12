import React from 'react';
import {Image, ScreenContainer, Box} from '../../design-system';
import SplashLogo from '../../assets/splash-logo.png';

const ImageStyle = {
  width: '100%',
};
export function SplashScreen() {
  return (
    <ScreenContainer testID="splash-screen">
      <Box alignItems="center" justifyContent="center" flex={1}>
        <Box width="57%">
          <Image source={SplashLogo} style={ImageStyle} resizeMode="contain" />
        </Box>
      </Box>
    </ScreenContainer>
  );
}
