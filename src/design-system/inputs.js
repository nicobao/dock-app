import React, {useState} from 'react';
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Input as NBInput,
  Popover,
  Pressable,
  Stack,
  Text,
} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';
import {InformationCircle} from '../assets/icons';

export {Select, Input, Text} from 'native-base';

export function SelectToggler({children, placeholder}) {
  const [contentVisible, setContentVisible] = useState();

  return (
    <Box>
      <TouchableWithoutFeedback
        onPress={() => setContentVisible(value => !value)}>
        <Stack
          backgroundColor="#27272A"
          mt={8}
          width={0.67}
          direction="row"
          alignItems="center"
          pl={5}
          pr={2}
          py="1px"
          borderRadius={6}>
          <Box flex={1}>
            <Text fontWeight={600} fontSize={14}>
              {placeholder}
            </Text>
          </Box>
          <Box mt={2}>
            {contentVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        </Stack>
      </TouchableWithoutFeedback>
      {contentVisible ? <Box>{children}</Box> : null}
    </Box>
  );
}

export function InputPopover({children}) {
  return (
    <Popover
      trigger={triggerProps => {
        return (
          <Pressable alignSelf="center" {...triggerProps}>
            <Box px={2} py={0.5}>
              <InformationCircle />
            </Box>
          </Pressable>
        );
      }}>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Body>{children}</Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
