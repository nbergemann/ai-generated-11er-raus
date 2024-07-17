// routes/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentPlayer } = useGameContext();

  if (!currentPlayer) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};