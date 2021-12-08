import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Box as HBox} from 'native-base';
import {Box, KeyboardDeleteIcon, Typography} from 'src/design-system';

function KeyboardButton({onPress, value, testID}) {
  return (
    <TouchableOpacity
      onPress={() => value !== null && onPress(value)}
      style={{flex: 1}}
      testID={testID}>
      <HBox flex={1} alignItems="center">
        <Box>
          <Typography variant="h1" fontSize={30} lineHeight={37}>
            {value}
          </Typography>
        </Box>
      </HBox>
    </TouchableOpacity>
  );
}

export function NumericKeyboard({
  value: defaultValue = 0,
  allowDecimal,
  onChange,
  marginTop,
  ...props
}) {
  const [value, setValue] = useState(defaultValue);

  const handleDelete = useCallback(() => {
    setValue(nextValue => {
      if (!nextValue) {
        return nextValue;
      }

      const strValue = `${nextValue}`;

      return strValue.substring(0, strValue.length - 1);
    });
  }, [setValue]);

  const handleDigit = useCallback(
    digit => {
      setValue(nextValue => {
        const strValue = nextValue ? `${nextValue}` : '';

        if (digit === '.' && strValue.indexOf('.') > -1) {
          return nextValue;
        }

        if (digit === '.') {
          return `${nextValue}.`;
        }

        const newValue = `${strValue}${digit}`;

        return allowDecimal ? parseFloat(newValue) : newValue;
      });
    },
    [setValue, allowDecimal],
  );

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, setValue]);

  useEffect(() => {
    onChange(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderDigit = useCallback(
    v => (
      <KeyboardButton
        key={v}
        onPress={handleDigit}
        value={v}
        testID={`keyboardNumber${v}`}
      />
    ),
    [handleDigit],
  );

  const layout = useMemo(() => {
    return (
      <Box flex marginTop={marginTop}>
        <Box
          justifyContent="center"
          flexDirection="row"
          row
          autoSize
          marginBottom={24}>
          {[1, 2, 3].map(renderDigit)}
        </Box>
        <Box
          justifyContent="center"
          flexDirection="row"
          row
          autoSize
          marginBottom={24}>
          {[4, 5, 6].map(renderDigit)}
        </Box>
        <Box
          justifyContent="center"
          flexDirection="row"
          row
          autoSize
          marginBottom={24}>
          {[7, 8, 9].map(renderDigit)}
        </Box>
        <Box
          justifyContent="center"
          flexDirection="row"
          row
          autoSize
          marginBottom={24}>
          {[allowDecimal ? '.' : null, 0].map(renderDigit)}
          <Box flex alignItems="center" paddingTop={5}>
            <TouchableOpacity onPress={handleDelete}>
              <KeyboardDeleteIcon />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    );
  }, [renderDigit, handleDelete, allowDecimal, marginTop]);

  return layout;
}
