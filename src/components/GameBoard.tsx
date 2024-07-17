// src/components/GameBoard.tsx
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { CustomTheme, lightTheme } from '../theme/theme';

interface GameBoardProps {
  board: { [color: string]: number[] };
}

const ColorSequence = styled(Paper)(({ theme }: { theme: CustomTheme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const CardChip = styled(Paper)<{ color: string }>(({ theme, color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  margin: theme.spacing(0.5),
  borderRadius: '50%',
  fontWeight: 'bold',
  backgroundColor: color,
  color: color === 'yellow' ? 'black' : 'white',
}));

export const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Game Board
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(board).map(([color, sequence]) => (
          <Grid item xs={12} sm={6} md={3} key={color}>
            <ColorSequence theme={lightTheme}>
              <Typography variant="h6" gutterBottom>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </Typography>
              <Box display="flex" flexWrap="wrap" justifyContent="center">
                {sequence.map((number, index) => (
                  <CardChip key={index} color={color}>
                    {number}
                  </CardChip>
                ))}
              </Box>
            </ColorSequence>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};