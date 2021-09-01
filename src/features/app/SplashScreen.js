import React from 'react';
import {Image, ScreenContainer, Box, Typography} from '../../design-system';

import SplashLogo from '../../assets/splash-logo.png';
import {BuildIdentifier} from './BuildIdentifier';

export function SplashScreen() {
  return (
    <ScreenContainer testID="splash-screen">
      <Box alignItems="center" justifyContent="center" flex={1}>
        <Box width="57%">
          <Image
            source={SplashLogo}
            style={{
              width: '100%',
            }}
            resizeMode="contain"
          />
        </Box>
      </Box>
    </ScreenContainer>
  );
}
