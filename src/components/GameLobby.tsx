import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameService } from '../services/GameService';
import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { Button, TextField, List, Typography, Paper, Box } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext';

interface GameLobbyProps {
  currentPlayer: Player;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ currentPlayer }) => {
  const [, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const gameService = new GameService(showMessage);
  useEffect(() => {
    const unsubscribe = gameService.listenToAvailableGames(setGames);
    return () => unsubscribe();
  }, []);

  const hostGame = async () => {
    try {
      const newGameId = await gameService.createGame(currentPlayer);
      navigate(`/game/${newGameId}`);
    } catch (error) {
      console.error('Failed to host game:', error);
    }
  };

  const joinGameById = async () => {
    try {
      await gameService.joinGame(gameId, currentPlayer);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Game Lobby
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={hostGame}>Host New Game</Button>
          <Button variant="contained" color="secondary" onClick={joinGameById}>Join Game</Button>
        </Box>
        <TextField
          fullWidth
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter game ID"
          margin="normal"
        />
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }} color="primary">
          Available Games:
        </Typography>
        <List>
          {/* {games.filter(g => g.status === 'waiting').map(game => (
            <ListItem key={game.gameId} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
              Game {game.gameId} - Players: {game.players.length}/6
            </ListItem>
          ))} */}
        </List>
      </Paper>
    </Box>
  );
};