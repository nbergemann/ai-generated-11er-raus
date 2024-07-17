import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { useGameContext } from '../context/GameContext';
import { Player } from '../models/Player';
import { TextField, Button, Typography, Box, Divider, Paper } from '@mui/material';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentPlayer } = useGameContext();
  const authService = new AuthService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await authService.signIn(email, password);
      setCurrentPlayer(new Player(user.uid, user.email || 'Anonymous'));
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      const user = await authService.signInAnonymously();
      setCurrentPlayer(new Player(user.uid, 'Anonymous Player'));
      navigate('/');
    } catch (error) {
      console.error('Anonymous login failed:', error);
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
    </Box>
  );
};