import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Button as NButton, Text, Box as NBox, Spinner, ITextProps} from 'native-base';
import {Box, rnStyleAttributes} from './grid';
import {Theme, useTheme} from './theme';
import {InteractionManager, Platform} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

export const ScreenContainer = styled.SafeAreaView`
  background-color: ${props => props.theme.screen.backgroundColor};
  flex: 1;
`;

export const Header = styled.View`
  padding: 22px 6px;
`;
export const Footer = styled(Box)``;
export const Content = styled(ScrollView)`
  flex: 1;
`;

export const Image = styled.Image``;
// alignself: stretch;

export * from '../assets/icons';
export * from './grid';
export * from './buttons';
export * from './inputs';
export * from './theme';
export * from './LoadingScreen';
export * from './list';

export const SText = styled(Text)`
  font-family: Nunito Sans;
  color: #d4d4d8;
`;

export function Typography(props) {
  const style = props.style || {};

  rnStyleAttributes.forEach(key => {
    if (props[key]) {
      style[key] = props[key];
    }
  });

  return <SText style={style}>{props.children}</SText>;
}

Typography.ScreenTitle = (props: ITextProps) => (
  <Typography
    fontFamily={Theme.fontFamily.montserrat}
    fontSize={17}
    fontWeight="600"
    color={Theme.colors.white}
    {...props}
  />
);
