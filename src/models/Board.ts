// models/Board.ts
import { Card } from './Card';

export class Board {
  private sequences: { [color: string]: number[] } = {
    red: [],
    yellow: [],
    green: [],
    blue: []
  };

  addCard(card: Card): void {
    this.sequences[card.color].push(card.number);
    this.sequences[card.color].sort((a, b) => a - b);
  }

  reset(): void {
    this.sequences = {
      red: [],
      yellow: [],
      green: [],
      blue: []
    };
  }

  isValidMove(card: Card): boolean {
    const sequence = this.sequences[card.color];
    if (sequence.length === 0) {
      return card.number === 11;
    }
    return card.number === sequence[sequence.length - 1] + 1 || card.number === sequence[0] - 1;
  }

  getSequences(): { [color: string]: number[] } {
    return { ...this.sequences };
  }

  getValidMoves(cards: Card[]): Card[] {
    return cards.filter(card => this.isValidMove(card));
  }

  static fromFirestore(data: any): Board {
    const board = new Board();
    board.sequences = data;
    return board;
  }

  toFirestore(): any {
    return { ...this.sequences };
  }
}