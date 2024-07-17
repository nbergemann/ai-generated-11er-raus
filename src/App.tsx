// App.tsx
import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { AppRoutes } from './routes/Routes';
import { ThemeProvider, CssBaseline, Container, Box, IconButton } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { SnackbarProvider } from './context/SnackbarContext';


const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <SnackbarProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <GameProvider>
          <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
              <AppRoutes />
            </Box>
          </Container>
        </GameProvider>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default App;