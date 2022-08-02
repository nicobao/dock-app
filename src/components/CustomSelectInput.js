import {
  Actionsheet,
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Stack,
} from 'native-base';
import React, {useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {Theme, Typography} from '../design-system';

export function CustomSelectInput({
  placeholder = '',
  items = [],
  renderItem,
  onPressItem,
}) {
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  return (
    <Box>
      <TouchableWithoutFeedback
        onPress={() => {
          setContentVisible(true);
        }}>
        <Stack
          backgroundColor={Theme.colors.secondaryBackground}
          direction="row"
          alignItems="center"
          pl={5}
          pr={1}
          py={1}
          borderRadius={6}>
          <Box flex={1}>
            {selectedValue ? (
              <Typography variant="selectText">{selectedValue}</Typography>
            ) : (
              <Typography variant="label">{placeholder}</Typography>
            )}
          </Box>
          <Box mt={2}>
            {contentVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        </Stack>
      </TouchableWithoutFeedback>
      <Actionsheet
        isOpen={contentVisible}
        onClose={() => {
          setContentVisible(false);
        }}>
        <Actionsheet.Content>
          {items.map((item, index) => {
            return (
              <Actionsheet.Item
                onPress={() => {
                  setSelectedValue(item.label);
                  onPressItem(item);
                  setContentVisible(false);
                }}
                key={`CustomSelectInput_${index}`}>
                {renderItem(item)}
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
}
