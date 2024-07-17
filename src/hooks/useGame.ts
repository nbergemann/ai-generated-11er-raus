// src/hooks/useGame.ts

import { useState, useEffect } from 'react';
import { GameService } from '../services/GameService';
import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { useSnackbar } from '../context/SnackbarContext';

export const useGame = (gameId: string, currentPlayer: Player) => {
  const [game, setGame] = useState<Game | null>(null);
  const { showMessage } = useSnackbar();
  const gameService = new GameService(showMessage);

  useEffect(() => {
    const unsubscribe = gameService.listenToGame(gameId, (updatedGame) => {
      setGame(updatedGame);
    });

    return () => unsubscribe();
  }, [gameId]);

  const playCard = async (card: Card) => {
    if (game) {
      await gameService.playCard(gameId, currentPlayer, card);
    }
  };

  const drawCard = async () => {
    if (game) {
      await gameService.drawCard(gameId, currentPlayer);
    }
  };

  return { game, playCard, drawCard };
};