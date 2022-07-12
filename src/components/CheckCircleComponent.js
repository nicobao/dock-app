import {CheckCircleIcon} from 'native-base';
import {Theme} from '../design-system';
import React from 'react';

export const CheckCircle = ({checked}) => (
  <CheckCircleIcon
    color={checked ? Theme.colors.circleChecked : Theme.colors.circleUnckecked}
    width={16}
    height={16}
    marginRight={2}
  />
);
