import React from 'react';
import styled from 'styled-components/native';
import {Button as NButton} from 'native-base';
import {Box, rnStyleAttributes} from './grid';

export const Theme = {
  screen: {
    backgroundColor: '#18181B',
  },
  button: {
    backgroundColor: '#1E75C5',
    textColor: '#fff',
  },
};

export const ScreenContainer = styled.SafeAreaView`
  background-color: ${props => props.theme.screen.backgroundColor};
  flex: 1;
`;

export function useTheme() {
  return {
    theme: Theme,
  };
}

/**
 * Button
 */
const StyledButton = styled(NButton)`
  background-color: ${props => props.theme.button.backgroundColor};
  padding: 13px;
  border-radius: 6px;
  height: 50px
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
  if (typeof children === 'string') {
    children = <StyledButtonText>{children}</StyledButtonText>
  }
  return (
    <StyledButton {...otherProps}>
      {icon && (
        <Box marginRight={15}>
          {icon}
        </Box>
      )}
      {children}
    </StyledButton>
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

export const Text = styled.Text`
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
    <Text style={style}>
      {props.children}
    </Text>
  )
}
