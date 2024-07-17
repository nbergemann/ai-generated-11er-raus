import { Card } from "./card";

export interface LastAction {
    playerId: string;
    action: 'play' | 'draw';
    cards: Card[];
  }