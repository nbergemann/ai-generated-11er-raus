import { Card } from "./card";

export interface Player {
    id: string;
    name: string;
    cards: Card[];
    score: number;
  }