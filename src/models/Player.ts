import { Card } from './Card';

export class Player {
  public handCards: Card[] = [];
  public score: number = 0;

  constructor(public playerId: string, public username: string) {}

  sortHandCards(): void {
    this.handCards.sort((a, b) => {
      if (a.color !== b.color) {
        const colorOrder = ['red', 'yellow', 'green', 'blue'];
        return colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color);
      }
      return a.number - b.number;
    });
  }

  addCard(card: Card): void {
    this.handCards.push(card);
    this.sortHandCards();
  }

  removeCard(card: Card): boolean {
    const index = this.handCards.findIndex(c => c.color === card.color && c.number === card.number);
    if (index !== -1) {
      this.handCards.splice(index, 1);
      return true;
    }
    return false;
  }

  calculateScore(): void {
    this.score = this.handCards.reduce((sum, card) => sum + card.number, 0);
  }

  toFirestore() {
    return {
      playerId: this.playerId,
      username: this.username,
      handCards: this.handCards.map(card => ({ color: card.color, number: card.number })),
      score: this.score
    };
  }

  static fromFirestore(data: any): Player {
    const player = new Player(data.playerId, data.username);
    player.handCards = data.handCards.map((c: any) => new Card(c.color, c.number));
    player.score = data.score;
    return player;
  }
}