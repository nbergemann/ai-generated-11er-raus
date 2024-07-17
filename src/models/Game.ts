// src/models/Game.ts

import { Player } from './Player';
import { Deck } from './Deck';
import { Board } from './Board';
import { Card } from './Card';

export class Game {
  public players: Player[] = [];
  public deck: Deck;
  public board: Board;
  public currentPlayerIndex: number = 0;
  public status: 'waiting' | 'in_progress' | 'finished' = 'waiting';
  public cardsDrawnThisTurn: number = 0;

  constructor() {
    this.deck = new Deck();
    this.board = new Board();
  }

  joinGame(player: Player): boolean {
    if (this.status !== 'waiting' || this.players.length >= 6) {
      return false;
    }
    this.players.push(player);
    return true;
  }


  startGame(): boolean {
    if (this.status !== 'waiting' || this.players.length < 2 || this.players.length > 6) {
      return false;
    }
    this.status = 'in_progress';
    this.deck = new Deck(); // Reset the deck
    this.board = new Board(); // Reset the board
    this.currentPlayerIndex = 0;
    this.dealInitialCards();
    this.findStartingPlayer();
    return true;
  }

  private findStartingPlayer(): void {
    const startingCards = ['red', 'yellow', 'green', 'blue'].map(color => new Card(color as 'red' | 'yellow' | 'green' | 'blue', 11));
    
    for (const card of startingCards) {
      const playerWithCard = this.players.find(player => 
        player.handCards.some(c => c.color === card.color && c.number === card.number)
      );
      
      if (playerWithCard) {
        this.currentPlayerIndex = this.players.indexOf(playerWithCard);
        return;
      }
    }

    // If no player has an 11, reshuffle and deal again
    this.deck.reset();
    this.players.forEach(player => player.handCards = []);
    this.dealInitialCards();
    this.findStartingPlayer();
  }

  private dealInitialCards(): void {
    const cardsPerPlayer = this.getCardsPerPlayer();
    this.players.forEach(player => {
      for (let i = 0; i < cardsPerPlayer; i++) {
        const card = this.deck.drawCard();
        if (card) player.addCard(card);
      }
    });
  }

  private getCardsPerPlayer(): number {
    switch (this.players.length) {
      case 2:
      case 3:
        return 20;
      case 4:
        return 15;
      case 5:
        return 12;
      case 6:
        return 10;
      default:
        return 0;
    }
  }

  playCard(player: Player, card: Card): boolean {
    if (this.status !== 'in_progress' || this.players[this.currentPlayerIndex] !== player) {
      return false;
    }

    if (this.isValidMove(card)) {
      player.removeCard(card);
      this.board.addCard(card);
      this.checkGameEnd();
      return true;
    }

    return false;
  }


  isValidMove(card: Card): boolean {
    return this.board.isValidMove(card);
  }

  drawCard(player: Player): Card | null {
    if (this.status !== 'in_progress' || this.players[this.currentPlayerIndex] !== player) {
      return null;
    }

    if (this.cardsDrawnThisTurn >= 3) {
      return null;
    }

    const card = this.deck.drawCard();
    if (card) {
      player.addCard(card);
      this.cardsDrawnThisTurn++;
      return card;
    }

    return null;
  }

  nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.cardsDrawnThisTurn = 0; // Reset the count for the new turn
  }



  private checkGameEnd(): void {
    const winner = this.players.find(player => player.handCards.length === 0);
    if (winner) {
      this.status = 'finished';
      this.players.forEach(player => player.calculateScore());
    }
  }

  endTurn(): void {
    if (this.status === 'in_progress') {
      this.nextTurn();
    }
  }

  getValidCards(player: Player): Card[] {
    return player.handCards.filter(card => this.isValidMove(card));
  }

  toFirestore() {
    return {
      // Remove gameId from here
      players: this.players.map(player => player.toFirestore()),
      status: this.status,
      currentPlayerIndex: this.currentPlayerIndex,
      board: this.board.toFirestore(),
      deck: this.deck.toFirestore(),
      cardsDrawnThisTurn: this.cardsDrawnThisTurn,
    };
  }

  static fromFirestore(data: any): Game {
    const game = new Game();
    // Remove setting gameId
    game.players = data.players.map((p: any) => Player.fromFirestore(p));
    game.status = data.status;
    game.currentPlayerIndex = data.currentPlayerIndex;
    game.board = Board.fromFirestore(data.board);
    game.deck = Deck.fromFirestore(data.deck);
    game.cardsDrawnThisTurn = data.cardsDrawnThisTurn || 0;
    return game;
  }


}