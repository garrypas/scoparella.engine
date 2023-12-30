import { Game } from '../Game';
import { Player } from '../models/Player';
import { Scoreboard } from '../scoring/Scoreboard';
import { RuleEngine } from '../rules/RuleEngine';

class ScoreboardMock extends Scoreboard {
  private _completed: boolean;
  constructor() {
    super();
    this._completed = false;
  }
  public set completed(value: boolean) {
    this._completed = value;
  }

  public get completed(): boolean {
    return this._completed;
  }
}

export class GameBuilder {
  private _players: Player[];
  private _handsToPlay: number;
  private _scoreboard: ScoreboardMock;
  private _ruleEngine: RuleEngine | undefined;
  private _takeEachHand: boolean;

  constructor() {
    this._players = [];
    this._handsToPlay = 0;
    this._scoreboard = new ScoreboardMock();
    this._takeEachHand = false;
  }

  addOnePlayer(): GameBuilder {
    this.addPlayers(1);
    return this;
  }

  addTwoPlayers(): GameBuilder {
    this.addPlayers(2);
    return this;
  }

  private addPlayers(numPlayers: number): GameBuilder {
    for (let i = 0; i < numPlayers; i++) {
      this._players.push(new Player());
    }
    return this;
  }

  playHands(handsToPlay: number): GameBuilder {
    this._handsToPlay = handsToPlay;
    return this;
  }

  playToEnd(): GameBuilder {
    this._handsToPlay = 18;
    return this;
  }

  playSingleRound(): GameBuilder {
    this._handsToPlay = 3;
    return this;
  }

  gameCompleted(): GameBuilder {
    this._scoreboard.completed = true;
    return this;
  }

  withRuleEngine(ruleEngine: RuleEngine): GameBuilder {
    this._ruleEngine = ruleEngine;
    return this;
  }

  withTakes(): GameBuilder {
    this._takeEachHand = true;
    return this;
  }

  preBuild(): Game {
    const game = new Game({
      numberOfPlayers: 2,
      scoreboard: this._scoreboard,
      ruleEngine: this._ruleEngine,
    });
    this._players.forEach((player) => game.addPlayer(player));
    return game;
  }

  build(): Game {
    return this.play(this.preBuild());
  }

  play(game: Game): Game {
    for (let i = 0; i < this._handsToPlay; i++) {
      const player1Take =
        this._takeEachHand && i % 2 === 0 ? [game.table.cards[0]] : [];
      const player2Take =
        this._takeEachHand && i % 2 !== 0 ? [game.table.cards[0]] : [];
      game.tryPlayCards(game.hands[0].cards[0], player1Take, game.hands[0]);
      game.tryPlayCards(game.hands[1].cards[0], player2Take, game.hands[1]);
    }
    return game;
  }
}
