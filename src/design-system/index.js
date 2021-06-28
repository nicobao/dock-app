import React from 'react';
import styled from 'styled-components/native';
import {Button as NButton} from 'native-base';
import {Box, rnStyleAttributes} from './grid';
import { useTheme } from './theme';

export * from '../assets/icons';
export const ScreenContainer = styled.SafeAreaView`
  background-color: ${props => props.theme.screen.backgroundColor};
  flex: 1;
`;

const StyledButtonText = styled.Text`
  color: ${props => props.theme.button.textColor};
  font-family: Nunito Sans;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

export function Button(props) {
  const {theme} = useTheme();
  let {children, icon, ...otherProps} = props;
  // if (typeof children === 'string') {
  //   children = <StyledButtonText>{children}</StyledButtonText>
  // }
  return (
    <NButton {...otherProps}>
      {icon && (
        <Box marginRight={15}>
          {icon}
        </Box>
      )}
      {children}
    </NButton>
  );
}

export const Header = styled.View`
  padding: 22px 6px;
`;
export const Footer = styled(Box)``;
export const Content = styled.View`
  flex: 1;
`;

export const Image = styled.Image`
  alignSelf: stretch;
`;


export * from './grid';
export * from './buttons';
export * from './inputs';
export * from './theme';

export const SText = styled.Text`
  font-family: Nunito Sans;
  color: #D4D4D8;
`;

export function Typography(props) {
  const style = props.style || {};
  
  rnStyleAttributes.forEach(key => {
		if (props[key]) {
			style[key] = props[key];
		}
	});
  
  
  return (
    <SText style={style}>
      {props.children}
    </SText>
  )
}
