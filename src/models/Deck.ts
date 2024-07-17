
import { Card } from './Card';

export class Deck {

  private cards: Card[] = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.cards = [];
    const colors: ('red' | 'yellow' | 'green' | 'blue')[] = ['red', 'yellow', 'green', 'blue'];
    colors.forEach(color => {
      for (let i = 1; i <= 20; i++) {
        this.cards.push(new Card(color, i));
      }
    });
    this.shuffle();
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(): Card | undefined {
    return this.cards.pop();
  }

  get remainingCards(): number {
    return this.cards.length;
  }

  toFirestore() {
    return {
      cards: this.cards.map(card => ({ color: card.color, number: card.number })),
    };
  }

  static fromFirestore(data: any): Deck {
    const deck = new Deck();
    deck.cards = data.cards.map((c: any) => new Card(c.color, c.number));
    return deck;
  }
}