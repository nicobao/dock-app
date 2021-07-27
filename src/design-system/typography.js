import {ITextProps, Text} from 'native-base';
import React, {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Theme} from './theme';

const headerVariantBase = {
  fontFamily: Theme.fontFamily.montserrat,
  lineHeight: 32,
  fontWeight: '600',
  color: Theme.colors.white,
};

type TypographyProps = ITextProps & {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'description' | 'list-description',
};

const variantsMap = {
  h1: {
    ...headerVariantBase,
    fontSize: 24,
  },
  h2: {
    ...headerVariantBase,
    fontSize: 20,
  },
  h3: {
    ...headerVariantBase,
    fontSize: 17,
  },
  h4: {
    ...headerVariantBase,
    fontSize: 14,
  },
  description: {
    ...headerVariantBase,
    fontSize: 17,
    fontWeight: 400,
    lineHeight: 22,
  },
  'list-description': {
    fontFamily: Theme.fontFamily.montserrat,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 22,
    color: '#A1A1AA',
  },
};

export const Typography: ComponentType<TypographyProps> = styled(Text)`
  font-family: Nunito Sans;
  line-height: 24px;
  color: #d4d4d8;
  ${({variant}) => {
    return variantsMap[variant] || {};
  }}
`;

