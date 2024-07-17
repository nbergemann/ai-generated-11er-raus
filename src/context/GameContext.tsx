// src/context/GameContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { Player } from '../models/Player';

interface GameContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName) {
          setCurrentPlayer(new Player(user.uid, user.displayName));
        } else {
          setCurrentPlayer(null); // This will trigger the name prompt in AuthWrapper
        }
      } else {
        setCurrentPlayer(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GameContext.Provider value={{ currentPlayer, setCurrentPlayer, isLoading }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};