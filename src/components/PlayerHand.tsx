// src/components/PlayerHand.tsx
import React from 'react';
import { Card } from '../models/Card';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CustomTheme } from '../theme/theme';

interface PlayerHandProps {
  cards: Card[];
  onPlayCard: (card: Card) => void;
  canPlay: boolean;
  validCards: Card[];
}

const HandContainer = styled(Paper)(({ theme }: { theme: CustomTheme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const CardButton = styled(Paper)<{ isValid: boolean; color: string }>(
  ({ theme, isValid, color }: { theme: CustomTheme; isValid: boolean; color: string }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 90,
    margin: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    fontWeight: 'bold',
    fontSize: '1.2rem',
    backgroundColor: color,
    color: color === 'yellow' ? 'black' : 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: isValid ? `3px solid ${theme.palette.secondary.main}` : 'none',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  })
);

export const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onPlayCard, canPlay, validCards }) => {
  const handlePlayCard = (card: Card) => {
    if (validCards.some(validCard => validCard.color === card.color && validCard.number === card.number)) {
      onPlayCard(card);
    } else {
      console.log('Invalid move: This card cannot be played now.');
    }
  };

  return (
    <HandContainer>
      <Typography variant="h5" gutterBottom align="center">
        Your Hand
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {cards.map((card, index) => {
          const isValid = validCards.some(validCard => validCard.color === card.color && validCard.number === card.number);
          return (
            <CardButton
              key={index}
              onClick={() => canPlay && handlePlayCard(card)}
              isValid={isValid}
              color={card.color}
              style={{ opacity: canPlay ? 1 : 0.6 }}
            >
              {card.number}
            </CardButton>
          );
        })}
      </Box>
    </HandContainer>
  );
};