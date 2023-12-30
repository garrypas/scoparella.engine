import { Game } from './Game';
import { Player } from './models/Player';
import { GameStatus } from './models/GameStatus';
import { GameBuilder } from './test-utils/GameBuilder';
import { RuleEngine } from './rules/RuleEngine';
import { PlayCardValidationResult } from './rules/PlayCardValidationResult';
import { Card } from './models/Card';
import { ComparableArray } from './core/ComparableArray';
import {
  NotThisPlayersTurnError,
  CannotAddMorePlayersError,
  PlayerAlreadyAddedError,
  CardsNotOnTableError,
} from './exceptions';

let _takeValidationResult: PlayCardValidationResult;
let _isScopaResult: boolean;
let _ruleEngine: RuleEngine;
let _gameBuilder: GameBuilder;

const _isScopaSpy = jest
  .spyOn(RuleEngine.prototype, 'isScopa')
  .mockImplementation(() => _isScopaResult);
const _validTakeSpy = jest
  .spyOn(RuleEngine.prototype, 'validPlay')
  .mockImplementation(() => _takeValidationResult);

beforeEach(() => {
  _takeValidationResult = PlayCardValidationResult.OK;
  _isScopaResult = false;
  _ruleEngine = new RuleEngine();
  _gameBuilder = new GameBuilder().withRuleEngine(_ruleEngine);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Game tests', () => {
  test('Not ready when there are not enough players', () => {
    const game = _gameBuilder.addOnePlayer().build();
    expect(game.status).toEqual(GameStatus.WAITING_FOR_PLAYERS);
  });

  test('In progress when cards have been dealt but some are on the deck', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(game.status).toEqual(GameStatus.IN_PROGRESS);
  });

  test('In progress when all cards have been dealt but some are on the table', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(game.status).toEqual(GameStatus.IN_PROGRESS);
  });

  test('Not ended when cards remain in hand', () => {
    const game = _gameBuilder.addTwoPlayers().playHands(17).build();
    expect(game.status).not.toEqual(GameStatus.ENDED);
  });

  test('In progress when all cards are dealt and none are on the table but round is not complete', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.status).toEqual(GameStatus.IN_PROGRESS);
  });

  test('Still in progress when all cards are dealt and none are on the table and round is complete', () => {
    const game = _gameBuilder
      .addTwoPlayers()
      .playToEnd()
      .gameCompleted()
      .build();
    expect(game.status).toEqual(GameStatus.IN_PROGRESS);
  });

  test('When round is ended the first player is rotated for the next round', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.whoseTurn?.equals(game.hands[0])).not.toBeTruthy();
    expect(game.whoseTurn?.equals(game.hands[1])).toBeTruthy();
  });

  test('When round is ended the number of rounds played is increased by 1', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.roundsPlayed).toEqual(1);
  });

  test('When round is not ended the number of rounds played is not increased', () => {
    const game = _gameBuilder.addTwoPlayers().playHands(17).build();
    expect(game.roundsPlayed).toEqual(0);
  });

  test('Returns scores', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.score(game.hands[0].player)).not.toBeUndefined();
    expect(game.score(game.hands[1].player)).not.toBeUndefined();
  });

  test('When round is ended the deck is replenished ready for the next game', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.deck).toHaveLength(30);
  });

  test('When game is ended cards are dealt to each player ready for the next round', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.hands[0].cards).toHaveLength(3);
    expect(game.hands[1].cards).toHaveLength(3);
  });

  test('When game is ended captured cards are reset to zero', () => {
    const game = _gameBuilder.addTwoPlayers().playToEnd().build();
    expect(game.hands[0].captured).toHaveLength(0);
    expect(game.hands[1].captured).toHaveLength(0);
  });

  test('Gives cards remaining on table to the last taker', () => {
    const game = _gameBuilder.addTwoPlayers().build();

    for (let i = 0; i < 18; i++) {
      game.tryPlayCards(game.hands[0].cards[0], [], game.hands[0]);
      if (i === 0) {
        const [knightOfCups, knightOfSwords] = [
          game.hands[1].cards[2],
          game.table.cards[0],
        ];
        game.tryPlayCards(knightOfCups, [knightOfSwords], game.hands[1]);
      } else {
        game.tryPlayCards(game.hands[1].cards[0], [], game.hands[1]);
      }
    }
    expect(game.hands[1].captured).toHaveLength(40);
  });

  test('Gives adds table awarded to last taker at the end of a round to the move log', () => {
    const game = _gameBuilder.addTwoPlayers().build();

    for (let i = 0; i < 18; i++) {
      game.tryPlayCards(game.hands[0].cards[0], [], game.hands[0]);
      if (i === 0) {
        const [knightOfCups, knightOfSwords] = [
          game.hands[1].cards[2],
          game.table.cards[0],
        ];
        game.tryPlayCards(knightOfCups, [knightOfSwords], game.hands[1]);
      } else {
        game.tryPlayCards(game.hands[1].cards[0], [], game.hands[1]);
      }
    }
    expect(game.moves).toHaveLength(37);
    expect(game.moves[game.moves.length - 1].taken).toHaveLength(38);
    expect(game.moves[game.moves.length - 1].card).toBeNull();
  });

  test('Deals 3 cards to each player once the game is ready to begin', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(game.hands[0].cards).toHaveLength(3);
    expect(game.hands[1].cards).toHaveLength(3);
  });

  test('Leaves 30 cards on the deck once cards have been dealt to players at the start of the game', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(game.deck.cards).toHaveLength(30);
  });

  test('Flops 4 cards on the table at the start of the game', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(game.table.cards).toHaveLength(4);
  });

  test('When game is ready to start player 1 goes first', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(game.whoseTurn).toEqual(game.hands[0]);
  });

  test('Player cannot play until it is their turn', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(() =>
      game.tryPlayCards(game.hands[1].cards[0], [], game.hands[1]),
    ).toThrow(NotThisPlayersTurnError);
  });

  test('Moves turn to next player', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    game.tryPlayCards(game.hands[0].cards[0], [], game.hands[0]);
    expect(game.whoseTurn?.equals(game.hands[1])).toBeTruthy();
  });

  test('Moves turn to first player when last player has gone', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    game.tryPlayCards(game.hands[0].cards[0], [], game.hands[0]);
    game.tryPlayCards(game.hands[1].cards[0], [], game.hands[1]);
    expect(game.whoseTurn?.equals(game.hands[0])).toBeTruthy();
  });

  test('Takes requested cards when request is valid', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    game.tryPlayCards(game.hands[0].cards[0], [], game.hands[0]);

    const knightOfCups = game.hands[1].cards[2];
    const knightOfSwords = game.table.cards[0];
    game.tryPlayCards(knightOfCups, [knightOfSwords], game.hands[1]);

    expect(game.hands[1].cards).not.toContain(knightOfCups);
    expect(game.hands[1].captured).toContain(knightOfCups);
    expect(game.hands[1].captured).toContain(knightOfSwords);
    expect(game.table.cards).not.toContain(knightOfSwords);
  });

  test('Fails to take requested cards when they are not on the table', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(() =>
      game.tryPlayCards(
        game.hands[0].cards[0],
        [game.hands[0].cards[0]],
        game.hands[0],
      ),
    ).toThrow(CardsNotOnTableError);
  });

  test('Puts card on table if it cannot be used to capture', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    const kingOfClubs = game.hands[0].cards[0];
    game.tryPlayCards(kingOfClubs, [], game.hands[0]);
    expect(game.hands[1].cards).not.toContain(kingOfClubs);
    expect(game.table.cards).toContain(kingOfClubs);
  });

  test('Throws error when trying to add more players than the maximum number the game can accept', () => {
    const game = _gameBuilder.addTwoPlayers().build();
    expect(() => game.addPlayer(new Player())).toThrow(
      CannotAddMorePlayersError,
    );
  });

  test('Throws error when trying to add players with the same IDs to the game', () => {
    const game = new Game({
      numberOfPlayers: 2,
    });
    game.addPlayer(new Player('1'));
    expect(() => game.addPlayer(new Player('1'))).toThrow(
      PlayerAlreadyAddedError,
    );
  });

  test("Deals next round when each player's hand is empty", () => {
    const game = _gameBuilder.addTwoPlayers().playSingleRound().build();
    expect(game.deck).toHaveLength(24);
    expect(game.hands[0].cards).toHaveLength(3);
    expect(game.hands[1].cards).toHaveLength(3);
  });

  test('Checks for scopa after each card is played', () => {
    _gameBuilder.addTwoPlayers().playSingleRound().build();
    expect(_isScopaSpy).toHaveBeenCalledTimes(6);
  });

  test('If round results in a scopa the scopa is counted', () => {
    _isScopaResult = true;
    const game = _gameBuilder.addTwoPlayers().playSingleRound().build();
    expect(game.scopas(game.hands[0].player)).toHaveLength(3);
    expect(game.scopas(game.hands[1].player)).toHaveLength(3);
  });

  test('Checks if move is valid', () => {
    _gameBuilder.addTwoPlayers().playSingleRound().build();
    expect(_validTakeSpy).toHaveBeenCalledTimes(6);
  });

  describe('moves()', () => {
    let _game: Game;
    let _cards1: Card[], _cards2: Card[];
    let _table: Card[];
    beforeEach(() => {
      const builder = _gameBuilder.addTwoPlayers().playHands(0);

      _game = builder.preBuild();
      _cards1 = _game.hands[0].cards;
      _cards2 = _game.hands[1].cards;
      _table = _game.table.cards;

      _game = builder.playHands(2).withTakes().play(_game);
    });

    test('Records moves', () => {
      expect(_game.moves).toHaveLength(4);
    });

    test('Records player', () => {
      expect(_game.moves[0].player.equals(_game.hands[0].player)).toBeTruthy();
      expect(_game.moves[1].player.equals(_game.hands[1].player)).toBeTruthy();
    });

    test('Records takes', () => {
      expect(_game.moves[0].taken).toHaveLength(1);
      expect(
        ComparableArray.isSubset(_game.moves[0].taken, [_table[0]]),
      ).toBeTruthy();
      expect(_game.moves[3].taken).toHaveLength(1);
      expect(
        ComparableArray.isSubset(_game.moves[3].taken, [_table[1]]),
      ).toBeTruthy();
    });

    test('Records card', () => {
      expect(_game.moves[0].card?.equals(_cards1[0])).toBeTruthy();
      expect(_game.moves[1].card?.equals(_cards2[0])).toBeTruthy();
      expect(_game.moves[2].card?.equals(_cards1[1])).toBeTruthy();
      expect(_game.moves[3].card?.equals(_cards2[1])).toBeTruthy();
    });
  });

  test('Throws and error if move is not valid', () => {
    _takeValidationResult = PlayCardValidationResult.INVALID;
    const game = _gameBuilder.addTwoPlayers().build();
    expect(() =>
      game.tryPlayCards(
        game.hands[0].cards[0],
        game.table.cards,
        game.hands[0],
      ),
    ).toThrow(PlayCardValidationResult.INVALID);
  });

  test('JSON serialization/deserialization', () => {
    const gameBefore = _gameBuilder.addTwoPlayers().playHands(2).build();
    let gameAfter: Game = Game.fromDto(Game.toDto(gameBefore));
    gameAfter = Game.fromJson(Game.toJson(gameAfter));
    expect(gameAfter.deck).not.toBeUndefined();
    expect(gameAfter.hands).not.toBeUndefined();
    expect(gameAfter.lastTaker).toEqual(gameBefore.lastTaker);
    expect(gameAfter.roundsPlayed).toEqual(gameBefore.roundsPlayed);
    expect(gameAfter.status).not.toBeUndefined();
    expect(gameAfter.status).toEqual(GameStatus.IN_PROGRESS);
    expect(gameAfter.table).not.toBeUndefined();
    expect(gameAfter.table).toHaveLength(gameBefore.table.cards.length);
    expect(gameAfter.whoseTurn).not.toBeUndefined();
    expect(gameAfter.moves).not.toBeUndefined();
    expect(gameAfter.moves).toHaveLength(gameBefore.moves.length);
    expect(gameAfter.moves).toHaveLength(4);
  });
});
