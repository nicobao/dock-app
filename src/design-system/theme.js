import React from 'react';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {ThemeProvider as SCThemeProvider} from 'styled-components/native';

export const Theme = {
  fontFamily: {
    nunitoSans: 'Nunito Sans',
    montserrat: 'Montserrat',
    satoshi: 'Satoshi',
    default: 'Satoshi',
  },
  borderRadius: 6,
  colors: {
    backdrop: 'rgba(0, 0, 0, 0.6)',
    transparent: 'transparent',
    text: '#D4D4D8',
    textHighlighted: '#ffffff',
    modalBackground: '#18181B',
    description: '#A1A1AA',
    info2: '#1E75C5',
    info: '#0284C7',
    error: '#DC2626',
    errorText: '#F87171',
    dividerBackground: '#ccc',
    headerText: '#fff',
    primaryBackground: '#18181B',
    secondaryBackground: '#27272A',
    tertiaryBackground: '#3F3F46',
    circleChecked: '#34D399',
    circleUnckecked: '#71717A',
    warningText: 'rgba(254, 243, 199, 1)',
    warningBackground: 'rgba(120, 53, 15, 0.3)',
    transactionCompleted: '#6EE7B7',
    transactionFailed: '#F87171',
    transactionPending: '#FBBF24',
    qrCodeBackground: '#fff',
    credentialCardBg: '#000',
    absoluteBlack: '#000',
    absoluteWhite: '#fff',

    btnWhiteBackground: '#F4F4F5',
    btnBlueBackground: '#0063F7',
    primaryBlue: '#0063F7',
  },
  screen: {
    backgroundColor: '#18181B',
  },
  button: {
    backgroundColor: '#0063F7',
    textColor: '#fff',
  },
  touchOpacity: 0.2,
};

export function useTheme() {
  return {
    theme: Theme,
  };
}

const nBaseTheme = extendTheme({
  colors: {
    primary: {
      // 50: '#E3F2F9',
      // 100: '#C5E4F3',
      // 200: '#A2D4EC',
      // 300: '#ccc',

      400: Theme.colors.primaryBlue,

      // 500: '#0088CC',
      // 600: '#007AB8',
      // 700: '#006BA1',
      // 800: '#005885',
      // 900: '#003F5E',
    },
    secondary: {
      400: Theme.colors.secondaryBackground,
    },
    tertiary: {
      400: Theme.colors.tertiaryBackground,
    },
  },
  components: {
    Select: {
      baseStyle: props => ({
        ...props,
        fontFamily: Theme.fontFamily.default,
      }),
    },
    Input: {
      baseStyle: {
        background: 'black',
        borderColor: Theme.colors.secondaryBackground,
        backgroundColor: Theme.colors.secondaryBackground,
        fontSize: '19px',
        fontFamily: Theme.fontFamily.default,
        _hover: {
          borderColor: Theme.colors.secondaryBackground,
        },
        _focus: {
          borderColor: Theme.colors.secondaryBackground,
        },
      },
      defaultProps: {
        w: '100%',
        bg: 'red',
      },
      variants: {
        outline: () => ({
          borderWidth: 0,
          borderColor: '#ccc',
        }),
      },
    },
    Text: {
      baseStyle: props => ({
        fontFamily: Theme.fontFamily.default,
      }),
    },
    Button: {
      variants: {
        whiteButton: props => ({
          bg: Theme.colors.btnWhiteBackground,
        }),
        transactionFilter: ({isActive}) => {
          return {
            bg: isActive
              ? Theme.colors.btnWhiteBackground
              : Theme.colors.secondaryBackground,
            mr: 1,
            role: 'button',
            paddingBottom: 0,
            paddingTop: 0,
          };
        },
        transactionRetry: ({}) => {
          return {
            bg: Theme.colors.btnWhiteBackground,
            role: 'button',
            mt: 3,
            borderRadius: 7,
          };
        },
      },
      baseStyle: props => ({
        bg: Theme.colors.error,
        rounded: 'full',
        _stack: {
          my: 1,
        },
        _text: {
          color: Theme.colors.textHighlighted,
        },
        borderRadius: 6,
      }),
      defaultProps: {
        // _stack: {
        //   my: 1
        // },
        // _text: {
        //   color: '#fff'
        // },
      },
    },
  },
  config: {
    initialColorMode: 'dark',
  },
});

export function ThemeProvider({children}) {
  return (
    <SCThemeProvider theme={Theme}>
      <NativeBaseProvider theme={nBaseTheme}>{children}</NativeBaseProvider>
    </SCThemeProvider>
  );
}
