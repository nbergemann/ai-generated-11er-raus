import { Board } from "./board";
import { Card } from "./card";
import { LastAction } from "./lastAction";
import { Player } from "./player";


export interface GameState {
  gameId: string;
  status: 'waiting' | 'in_progress' | 'finished';
  currentPlayerIndex: number;
  players: Player[];
  deck: Card[];
  board: Board;
  lastAction: LastAction;
}