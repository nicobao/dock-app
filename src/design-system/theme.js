import React from 'react';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {ThemeProvider as SCThemeProvider} from 'styled-components/native';

export const Theme = {
  fontFamily: {
    nunitoSans: 'Nunito Sans',
    montserrat: 'Montserrat',
  },
  colors: {
    white: '#FFF',
    shark: '#27272A',
    mariner: '#1E75C5'
  },
  screen: {
    backgroundColor: '#18181B',
  },
  button: {
    backgroundColor: '#1E75C5',
    textColor: '#fff',
  },
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
      
      400: Theme.colors.mariner,
      
      // 500: '#0088CC',
      // 600: '#007AB8',
      // 700: '#006BA1',
      // 800: '#005885',
      // 900: '#003F5E',
    },
  },
  components: {
    Input: {
      baseStyle: {
        background: 'black',
        borderColor: Theme.colors.shark,
        backgroundColor: Theme.colors.shark,
        fontSize: '19px',
        _hover: {
          borderColor: Theme.colors.shark
        },
        _focus: {
          borderColor: Theme.colors.shark
        },
        
      },
      defaultProps: {
        w:"100%",
        bg: 'red',
      },
      variants: {
        outline: () => ({
          borderWidth: 0,
          borderColor: '#ccc'
        })
      }
    },
    Text: {
      baseStyle: (props) => ({
        fontFamily: !props.montserrat ? 'Nunito Sans' : 'Montserrat'
      }),
    },
    Button: {
      baseStyle: (props) => ({
        _stack: {
          my: 1
        },
        _text: {
          color: Theme.colors.white,
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
      }
    }
  },
  config: {
    initialColorMode: 'dark',
  },
})

export function ThemeProvider({children}) {
  return (
    <SCThemeProvider theme={Theme}>
      <NativeBaseProvider theme={nBaseTheme}>{children}</NativeBaseProvider>
    </SCThemeProvider>
  );
}
