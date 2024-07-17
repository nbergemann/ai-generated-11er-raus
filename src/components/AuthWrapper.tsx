// src/components/AuthWrapper.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { CircularProgress, Box } from '@mui/material';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentPlayer } = useGameContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!currentPlayer && location.pathname !== '/login') {
        navigate('/login');
      } else if (currentPlayer && location.pathname === '/login') {
        navigate('/');
      }
    }
  }, [currentPlayer, isLoading, navigate, location.pathname]);

  useEffect(() => {
    const checkAuthState = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Add a small delay to ensure Firebase has time to initialize

    return () => clearTimeout(checkAuthState);
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};