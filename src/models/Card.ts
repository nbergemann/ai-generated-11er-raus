export class Card {
    constructor(public color: 'red' | 'yellow' | 'green' | 'blue', public number: number) {}
  
    toString(): string {
      return `${this.color} ${this.number}`;
    }
  }