// src/theme/theme.ts
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    // Add any custom properties here if needed
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions extends CustomTheme {}
}

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#F7FFF7',
      paper: '#FFFFFF',
    },
  },
} as ThemeOptions;

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#1A1A2E',
      paper: '#16213E',
    },
  },
} as ThemeOptions;

const lightTheme = createTheme(lightThemeOptions);
const darkTheme = createTheme(darkThemeOptions);

export { lightTheme, darkTheme };
export type CustomTheme = typeof lightTheme;
