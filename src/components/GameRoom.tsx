// components/GameRoom.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { GameBoard } from './GameBoard';
import { PlayerHand } from './PlayerHand';
import { GameService } from '../services/GameService';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Celebration } from './Celebration';
import { useSnackbar } from '../context/SnackbarContext';
interface GameRoomProps {
  currentPlayer: Player;
}

export const GameRoom: React.FC<GameRoomProps> = ({ currentPlayer }) => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [drawnCards, setDrawnCards] = useState<number>(0);
  const [playedCards, setPlayedCards] = useState<number>(0);
  const [, setSnackbarOpen] = useState<boolean>(false);
  const [, setShowCelebration] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [, setShowRestartDialog] = useState<boolean>(false);
  const { showMessage } = useSnackbar();
  const gameService = new GameService(showMessage);  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = gameService.listenToGame(gameId, (updatedGame) => {
      if (updatedGame) {
        setGame(updatedGame);
        setDrawnCards(0);

        // Check for a winner
        const gameWinner = updatedGame.players.find(player => player.handCards.length === 0);
        if (gameWinner && updatedGame.status === 'finished') {
          setWinner(gameWinner);
          setShowCelebration(true);
          setTimeout(() => {
            setShowCelebration(false);
            setShowRestartDialog(true);
          }, 5000); // Show celebration for 5 seconds
        }
      } else {
        console.error('Game not found');
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [gameId, navigate]);


  const handlePlayCard = async (card: Card) => {
    if (game && gameId) {
      try {
        await gameService.playCard(gameId, currentPlayer, card);
        setPlayedCards(prev => prev + 1);
      } catch (error) {
        console.error('Failed to play card:', error);
      }
    }
  };

  const handleDrawCard = async () => {
    if (game && gameId) {
      try {
        const drawnCard = await gameService.drawCard(gameId, currentPlayer);
        if (drawnCard) {
          setDrawnCards(prev => prev + 1);
        
          if (game.isValidMove(drawnCard)) {
            // If a valid card is drawn, stop drawing
            return;
          }
        
          if (drawnCards + 1 >= 3) {
            // If 3 cards have been drawn and none are valid, end the turn
            await handleEndTurn();
            setSnackbarOpen(true);
          }
        }
      } catch (error) {
        console.error('Failed to draw card:', error);
        // Show an error message to the user
        setSnackbarOpen(true);
      }
    }
  };

  const handleEndTurn = async () => {
    if (game && gameId) {
      try {
        await gameService.endTurn(gameId, currentPlayer);
        setDrawnCards(0); // Reset drawn cards count
        setPlayedCards(0); // Reset played cards count
      } catch (error) {
        console.error('Failed to end turn:', error);
      }
    }
  };




  const handleReturnToLobby = () => {
    navigate('/');
  };

  if (!game) {
    return <div>Loading game...</div>;
  }
  
  const isCurrentPlayerTurn = game.players[game.currentPlayerIndex].playerId === currentPlayer.playerId;
  const currentPlayerInGame = game.players.find(p => p.playerId === currentPlayer.playerId);
  const canEndTurn = playedCards > 0 || drawnCards >= 3 || (game.getValidCards(currentPlayerInGame!).length <1 && game.deck.remainingCards < 1);


  return (
    <Box>
      <Typography variant="h4">Game Room: {gameId}</Typography>
      {game.status !== 'finished' && (
        <>
          <GameBoard board={game.board.getSequences()} />
          {currentPlayerInGame && (
            <PlayerHand 
              cards={currentPlayerInGame.handCards} 
              onPlayCard={handlePlayCard}
              canPlay={isCurrentPlayerTurn}
              validCards={game.getValidCards(currentPlayerInGame)}
            />
          )}
          <Button onClick={handleDrawCard} disabled={!isCurrentPlayerTurn || drawnCards >= 3}>
            Draw Card {drawnCards > 0 && `(${drawnCards}/3)`}
          </Button>
          <Button onClick={handleEndTurn} disabled={!isCurrentPlayerTurn || !canEndTurn}>
            End Turn
          </Button>
          <Typography>Cards left in deck: {game.deck.remainingCards}</Typography>
          <Box>
            <Typography variant="h6">Players:</Typography>
            <ul>
              {game.players.map((player, index) => (
                <li key={player.playerId}>
                  {player.username} - Cards: {player.handCards.length}
                  {index === game.currentPlayerIndex && " (Current Turn)"}
                </li>
              ))}
            </ul>
          </Box>
        </>
      )}

      {winner && (
        <>
          <Celebration winnerName={winner.username} />
          <Dialog open={true}>
            <DialogTitle>Game Over</DialogTitle>
            <DialogContent>
              <Typography>
                {winner.username} has won the game!
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleReturnToLobby} variant="contained" color="primary">
                Return to Lobby
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};