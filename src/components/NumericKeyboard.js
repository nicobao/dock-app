import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Box, KeyboardDeleteIcon, Typography} from 'src/design-system';

function KeyboardButton({onPress, value, testID}) {
  return (
    <Box flex alignItems="center">
      <TouchableOpacity
        onPress={() => value !== null && onPress(value)}
        testID={testID}>
        <Box>
          <Typography variant="h1" fontSize={30} lineHeight={37}>
            {value}
          </Typography>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

export function NumericKeyboard({
  value: defaultValue = 0,
  allowDecimal,
  ...props
}) {
  const [value, setValue] = useState(defaultValue);

  const handleDelete = useCallback(() => {
    setValue(value => {
      if (!value) {
        return value;
      }

      const strValue = `${value}`;

      return strValue.substring(0, strValue.length - 1);
    });
  }, [setValue]);

  const handleDigit = useCallback(
    digit => {
      setValue(value => {
        const strValue = value ? `${value}` : '';

        if (digit === '.' && strValue.indexOf('.') > -1) {
          return value;
        }

        if (digit === '.') {
          return `${value}.`;
        }

        const newValue = `${strValue}${digit}`;

        return allowDecimal ? parseFloat(newValue) : newValue;
      });
    },
    [setValue],
  );

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, setValue]);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

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
      <Box {...props} flex>
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
  }, [renderDigit, handleDelete]);

  return layout;
}
