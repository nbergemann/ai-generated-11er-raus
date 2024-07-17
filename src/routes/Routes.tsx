// src/routes/Routes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameLobby } from '../components/GameLobby';
import { GameRoom } from '../components/GameRoom';
import { Login } from '../components/Login';
import { PrivateRoute } from './PrivateRoute';
import { useGameContext } from '../context/GameContext';
import { AuthWrapper } from '../components/AuthWrapper';

export const AppRoutes: React.FC = () => {
  const { currentPlayer } = useGameContext();

  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <GameLobby currentPlayer={currentPlayer!} />
              </PrivateRoute>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <PrivateRoute>
                <GameRoom currentPlayer={currentPlayer!} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthWrapper>
    </Router>
  );
};