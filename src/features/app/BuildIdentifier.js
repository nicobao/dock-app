import { Typography } from "src/design-system";
import DeviceInfro from 'react-native-device-info';
import { Stack } from 'native-base';
import React from 'react';

export function BuildIdentifier() {
  return (
    <Stack direction="row" justifyContent="flex-end">
      <Typography fontSize="10px">Dock Wallet {DeviceInfro.getVersion()} Build {DeviceInfro.getBuildNumber()}</Typography>
    </Stack>
  )
}