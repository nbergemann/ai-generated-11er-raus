// src/components/AuthWrapper.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { AuthService } from '../services/AuthService';
import { Player } from '../models/Player';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { currentPlayer, setCurrentPlayer } = useGameContext();
  const navigate = useNavigate();
  const location = useLocation();
  const authService = new AuthService();

  useEffect(() => {
    const checkAuth = async () => {
      const user = authService.getCurrentUser();
      if (user) {
        if (user.displayName) {
          setCurrentPlayer(new Player(user.uid, user.displayName));
        } else {
          setShowNameDialog(true);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [setCurrentPlayer]);

  useEffect(() => {
    if (!isLoading) {
      if (!currentPlayer && location.pathname !== '/login') {
        navigate('/login');
      } else if (currentPlayer && location.pathname === '/login') {
        navigate('/');
      }
    }
  }, [currentPlayer, isLoading, navigate, location.pathname]);

  const handleNameSubmit = async () => {
    if (displayName.trim()) {
      const user = authService.getCurrentUser();
      if (user) {
        await authService.updateProfile(user, { displayName });
        setCurrentPlayer(new Player(user.uid, displayName));
        setShowNameDialog(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {children}
      <Dialog open={showNameDialog} onClose={() => {}}>
        <DialogTitle>Enter Display Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Display Name"
            type="text"
            fullWidth
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNameSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};