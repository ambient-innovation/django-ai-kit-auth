import { Color, createMuiTheme } from '@material-ui/core';

export const defaultPrimaryColor: Color = {
  50: '#E1F4FF',
  100: '#B3E3FE',
  200: '#80D1FD',
  300: '#4DBFFA',
  400: '#28B1F9',
  500: '#16A3F6',
  600: '#1796E6',
  700: '#1883D2',
  800: '#1772BD',
  900: '#17529A',
  A100: '#4DBFFA',
  A200: '#4DBFFA',
  A400: '#4DBFFA',
  A700: '#4DBFFA',
};

export const defaultSecondaryColor: Color = {
  50: '#F5F5F5',
  100: '#E9E9E9',
  200: '#D9D9D9',
  300: '#C4C4C4',
  400: '#9D9D9D',
  500: '#7B7B7B',
  600: '#555555',
  700: '#434343',
  800: '#262626',
  900: '#000000',
  A100: '#000000',
  A200: '#000000',
  A400: '#000000',
  A700: '#000000',
};

export const defaultTheme = createMuiTheme({
  palette: {
    common: {
      black: '#000',
      white: '#FFF',
    },
    type: 'light',
    primary: {
      light: defaultPrimaryColor[50],
      main: defaultPrimaryColor[300],
      dark: defaultPrimaryColor[900],
      contrastText: 'rgba(0,0,0,0.87)',
    },
    secondary: {
      light: defaultSecondaryColor[50],
      main: defaultSecondaryColor[900],
      dark: defaultSecondaryColor[900],
      contrastText: '#FFF',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
      disabled: 'rgba(0,0,0,0.38)',
    },
  },
  typography: {
    fontFamily: '"Nunito Sans", "Helvetica", "Arial", sans-serif',
    htmlFontSize: 16,
    h1: {
      fontFamily: '"Josefin Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '6.5rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: '"Josefin Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '4rem',
      fontWeight: 300,
      letterSpacing: '-0.5px',
      fontStyle: 'italic',
    },
    h3: {
      fontFamily: '"Josefin Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '3.25rem',
      fontWeight: 400,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: '"Josefin Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '2.3rem',
      fontWeight: 400,
      letterSpacing: '0.25px',
    },
    h5: {
      fontFamily: '"Josefin Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '1.6275rem',
      fontWeight: 400,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: '"Josefin Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '1.35rem',
      fontWeight: 400,
      letterSpacing: '0.25px',
    },
    body1: {
      fontSize: '1.085rem',
      fontWeight: 400,
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '0.95rem',
      fontWeight: 400,
      letterSpacing: '0.25px',
    },
    subtitle1: {
      fontSize: '1.085rem',
      fontWeight: 400,
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontSize: '0.95rem',
      fontWeight: 400,
      letterSpacing: '0.1px',
    },
    button: {
      fontSize: '0.95rem',
      fontWeight: 400,
      letterSpacing: '1.25px',
    },
    caption: {
      fontSize: '0.81375rem',
      fontWeight: 400,
      letterSpacing: '0.4px',
    },
    overline: {
      fontSize: '0.81375rem',
      fontWeight: 400,
      letterSpacing: '2px',
    },
  },
  overrides: {
    MuiInputLabel: {
      root: {
        fontStyle: 'italic',
      },
    },
  },
});
