import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Button as NButton, Text, Box as NBox, Spinner} from 'native-base';
import {Box, rnStyleAttributes} from './grid';
import {useTheme} from './theme';
import {InteractionManager, Platform} from 'react-native';

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

export const runAfterInteractions =
  Platform.OS === 'ios'
    ? InteractionManager.runAfterInteractions
    : cb => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(cb, 100);
        });
      };

export const useAsyncCallback = func => {
  const [loading, setLoading] = useState();
  const callback = () => {
    setLoading(true);
    runAfterInteractions(() => {
      Promise.resolve(func()).finally(() => {
        setLoading(false);
      });
    });
  };

  return [loading, callback];
};

export function LoadingButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress);

  return <Button {...props} onPress={onPress} isLoading={loading} />;
}

export function BigButton({icon, children, ...props}) {
  const [loading, onPress] = useAsyncCallback(props.onPress);

  return (
    <Box
      row
      borderWidth={1}
      borderColor="#3F3F46"
      borderRadius={8}
      padding={25}
      marginBottom={12}
      alignItems="center"
      {...props}
      onPress={onPress}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Box autoSize col>
            {icon}
          </Box>
          <Box>
            <Text
              fontSize={14}
              fontFamily="Nunito Sans"
              fontWeight="600"
              color="#fff">
              {children}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}

export function Button(props) {
  const {theme} = useTheme();
  let {children, icon, ...otherProps} = props;
  // if (typeof children === 'string') {
  //   children = <StyledButtonText>{children}</StyledButtonText>
  // }
  return (
    <NButton {...otherProps}>
      {icon && <Box marginRight={15}>{icon}</Box>}
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

export const Image = styled.Image``;
// alignself: stretch;

export * from './grid';
export * from './buttons';
export * from './inputs';
export * from './theme';

export const SText = styled.Text`
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
