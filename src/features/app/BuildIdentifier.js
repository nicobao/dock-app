import {Typography} from 'src/design-system';
import DeviceInfro from 'react-native-device-info';
import {Pressable, Stack} from 'native-base';
import React, { useState } from 'react';

const UNLOCK_PRESS_COUNT = 8;

export function BuildIdentifier({ onUnlock }) {
  const [pressCount, setPressCount] = useState(0);

  return (
    <Pressable onPress={() => {
      if (pressCount >= UNLOCK_PRESS_COUNT - 1 && onUnlock) {
        return onUnlock();
      }

      setPressCount(p => p + 1);
    }}>
      <Stack direction="row" justifyContent="flex-end">
        <Typography fontSize="10px">
          Dock Wallet {DeviceInfro.getVersion()} Build{' '}
          {DeviceInfro.getBuildNumber()}
        </Typography>
      </Stack>
    </Pressable>
  );
}
