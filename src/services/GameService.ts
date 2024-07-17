// src/services/GameService.ts

import { FirestoreService } from './FirestoreService';
import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { Card } from '../models/Card';

export class GameService {
  private firestoreService: FirestoreService;
  private showMessage: (message: string) => void;

  constructor(showMessage: (message: string) => void) {
    this.firestoreService = new FirestoreService();
    this.showMessage = showMessage;
  }

  async restartGame(gameId: string): Promise<void> {
    return this.updateGame(gameId, (game) => {
      const players = game.players.map(player => new Player(player.playerId, player.username));
      game = new Game();
      players.forEach(player => game.joinGame(player));
      game.startGame(); // This will reset the deck, deal new cards, and set up the initial game state
    });
  }

  
  listenToAvailableGames(callback: (games: Game[]) => void): () => void {
    return this.firestoreService.listenToCollection<Game>('games', (gamesData) => {
      const availableGames = gamesData
        .filter(game => game.status === 'waiting')
        .map(game => Game.fromFirestore(game));
      callback(availableGames);
    });
  }

  async createGame(host: Player): Promise<string> {
    const game = new Game();
    game.joinGame(host);
    const gameData = game.toFirestore();
    return await this.firestoreService.addDocument('games', gameData);
  }

  listenToGame(gameId: string, callback: (game: Game | null) => void): () => void {
    return this.firestoreService.listenToDocument<any>(`games/${gameId}`, (gameData) => {
      if (gameData) {
        const game = Game.fromFirestore(gameData);
        callback(game);
      } else {
        callback(null);
      }
    });
  }

  async updateGame(gameId: string, updateFn: (game: Game) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.listenToGame(gameId, async (game) => {
        unsubscribe();
        if (game) {
          updateFn(game);
          const updateData = game.toFirestore();
          await this.firestoreService.updateDocument(`games/${gameId}`, updateData);
          resolve();
        } else {
          reject(new Error('Game not found'));
        }
      });
    });
  }


  async joinGame(gameId: string, player: Player): Promise<void> {
    return this.updateGame(gameId, (game) => {
      game.joinGame(player);
    });
  }

  async startGame(gameId: string): Promise<void> {
    return this.updateGame(gameId, (game) => {
      if (!game.startGame()) {
        this.showMessage('Unable to start the game. Make sure there are 2-6 players and the game is in waiting status.');
      }
    });
  }

  async playCard(gameId: string, player: Player, card: Card): Promise<void> {
    return this.updateGame(gameId, (game) => {
      const currentPlayer = game.players.find(p => p.playerId === player.playerId);
      if (!currentPlayer) {
        throw new Error('Player not found in the game');
      }
      if (!game.playCard(currentPlayer, card)) {
        throw new Error('Invalid move');
      }
    });
  }

  async endTurn(gameId: string, player: Player): Promise<void> {
    return this.updateGame(gameId, (game) => {
      const currentPlayer = game.players.find(p => p.playerId === player.playerId);
      if (!currentPlayer) {
        throw new Error('Player not found in the game');
      }
      if (game.players[game.currentPlayerIndex].playerId !== player.playerId) {
        throw new Error('It is not your turn');
      }
      game.endTurn();
    });
  }
  
  async drawCard(gameId: string, player: Player): Promise<Card | null> {
    return new Promise((resolve, reject) => {
      this.updateGame(gameId, (game) => {
        const currentPlayer = game.players.find(p => p.playerId === player.playerId);
        if (!currentPlayer) {
          reject(new Error('Player not found in the game'));
          return;
        }
        if (game.players[game.currentPlayerIndex].playerId !== player.playerId) {
          reject(new Error('It is not your turn'));
          return;
        }
        if (game.cardsDrawnThisTurn >= 3) {
          reject(new Error('You cannot draw more than 3 cards per turn'));
          return;
        }
        const drawnCard = game.drawCard(currentPlayer);
        resolve(drawnCard);
      }).catch(reject);
    });
  }
}