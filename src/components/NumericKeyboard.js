import React from 'react';
import {Box, KeyboardDeleteIcon, Typography} from 'src/design-system';

function KeyboardButton({onPress, value, testID}) {
  return (
    <Box
      testID={testID}
      flex
      alignItems="center"
      onPress={() => value !== null && onPress(value)}>
      <Typography variant="h1" fontSize={30} lineHeight={37}>
        {value}
      </Typography>
    </Box>
  );
}

export function NumericKeyboard({onChange, value, allowDecimal, ...props}) {
  const handleDelete = () => {
    if (!value) {
      return;
    }

    const strValue = `${value}`;

    onChange(strValue.substring(0, strValue.length - 1));
  };

  const handleDigit = digit => {
    const strValue = value ? `${value}` : '';

    if (digit === '.' && strValue.indexOf('.') > -1) {
      return;
    }

    const newValue = `${strValue}${digit}`;

    onChange(allowDecimal ? parseFloat(newValue) : newValue);
  };

  const renderDigit = v => (
    <KeyboardButton
      key={v}
      onPress={handleDigit}
      value={v}
      testID={`keyboardNumber${v}`}
    />
  );

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
        <Box flex alignItems="center" paddingTop={5} onPress={handleDelete}>
          <KeyboardDeleteIcon />
        </Box>
      </Box>
    </Box>
  );
}
