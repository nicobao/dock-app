import React, {useState} from 'react';
import {InteractionManager, Platform} from 'react-native';
import {Button as NButton, Text, Box as NBox, Spinner} from 'native-base';
import BackIcon from '../assets/icons/back.svg';
import {navigateBack} from '../core/navigation';
import {Box} from './grid';
import {Typography} from '.';

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

export function BackButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress || navigateBack);

  return (
    <Box flexDirection="row" onPress={onPress}>
      {loading ? (
        <Spinner size={12} />
      ) : (
        <>
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
        </>
      )}
    </Box>
  );
}

export function IconButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress);

  return (
    <Box col {...props} onPress={onPress}>
      {loading ? <Spinner size={12} /> : props.children}
    </Box>
  );
}

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
  let {children, icon, ...otherProps} = props;

  return (
    <NButton {...otherProps}>
      {icon && <Box marginRight={15}>{icon}</Box>}
      {children}
    </NButton>
  );
}
