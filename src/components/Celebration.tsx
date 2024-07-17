// src/components/Celebration.tsx

import React, { useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { Typography, Box } from '@mui/material';

interface CelebrationProps {
  winnerName: string;
}

export const Celebration: React.FC<CelebrationProps> = ({ winnerName }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/path-to-celebration-sound.mp3');
    audioRef.current.play().catch(error => console.error("Audio play failed:", error));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);


  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
      }}
    >
      <Confetti />
      <Typography variant="h2" color="primary" gutterBottom>
        🎉 Congratulations! 🎉
      </Typography>
      <Typography variant="h3" color="secondary">
        {winnerName} wins! 🏆
      </Typography>
      <Typography variant="h4" color="primary" sx={{ mt: 2 }}>
        🎊🥳🎊
      </Typography>
    </Box>
  );
};