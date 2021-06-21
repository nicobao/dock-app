import React from 'react';
import {Typography} from '.';
import {Box} from './grid';
import BackIcon from '../assets/icons/back.svg';
import { navigateBack } from '../core/navigation';

export function BackButton(props) {
  return (
    <Box flexDirection="row" onPress={props.onPress || navigateBack}>
      <BackIcon />
      <Typography
        fontFamily="Montserrat"
        fontSize={17}
        lineHeight={22}
        marginLeft={6}
        color="#fff"
        fontWeight="400">
        Back
      </Typography>
    </Box>
  );
}
