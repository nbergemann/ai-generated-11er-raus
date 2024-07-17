// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { useGameContext } from '../context/GameContext';
import { Player } from '../models/Player';
import { TextField, Button, Typography, Box, Divider, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const navigate = useNavigate();
  const { setCurrentPlayer } = useGameContext();
  const authService = new AuthService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await authService.signIn(email, password);
      if (user.displayName) {
        setCurrentPlayer(new Player(user.uid, user.displayName));
        navigate('/');
      } else {
        setShowNameDialog(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      const user = await authService.signInAnonymously();
      setShowNameDialog(true);
    } catch (error) {
      console.error('Anonymous login failed:', error);
    }
  };

  const handleNameSubmit = async () => {
    if (displayName.trim()) {
      const user = authService.getCurrentUser();
      if (user) {
        await authService.updateProfile(user, { displayName });
        setCurrentPlayer(new Player(user.uid, displayName));
        setShowNameDialog(false);
        navigate('/');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          11er Raus
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleAnonymousLogin}
        >
          Play Anonymously
        </Button>
      </Paper>

      <Dialog open={showNameDialog} onClose={() => setShowNameDialog(false)}>
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
          <Button onClick={() => setShowNameDialog(false)}>Cancel</Button>
          <Button onClick={handleNameSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};