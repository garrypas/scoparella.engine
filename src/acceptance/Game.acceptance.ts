import { Game } from '../../src/Game';
import { Player } from '../../src/models/Player';
import { Card } from '../../src/models/Card';
import { Hand } from '../../src/models/Hand';
import { GameStatus } from '../../src/models/GameStatus';
import { NotThisPlayersTurnError } from '../exceptions';

function getExactMatch(
  cardInHand: Card,
  cardsOnTable: Card[],
): Card | undefined {
  return cardsOnTable.find((cardOnTable) => cardOnTable.faceEquals(cardInHand));
}

function getSumMatch(
  cardInHand: Card,
  cardsOnTable: Card[],
): Card[] | undefined {
  return cardInHand.getFaceSumMatches(cardsOnTable)[0] || undefined;
}

function determineWhichCardsIfAnyCanBeTakenWithAGivenCardInHand(
  cardInHand: Card,
  cardsOnTable: Card[],
): Card[] {
  const exactMatch = getExactMatch(cardInHand, cardsOnTable);
  if (exactMatch) {
    return [exactMatch];
  }
  const sumMatch = getSumMatch(cardInHand, cardsOnTable);
  if (sumMatch) {
    return sumMatch;
  }
  return [];
}

describe('Game acceptance tests', () => {
  let game: Game;
  beforeEach(() => {
    game = new Game({
      numberOfPlayers: 2,
    });
  });

  const playCard = (hand: Hand) => {
    const card = hand.cards[0];
    const cardsThatCanBeTaken =
      determineWhichCardsIfAnyCanBeTakenWithAGivenCardInHand(
        card,
        game.table.cards,
      );
    game.tryPlayCards(card, cardsThatCanBeTaken, hand);
    // Go through serialization loop to ensure game does not depend on object
    // references that might break during serialization/deserialization:
    game = Game.fromJson(JSON.stringify(Game.toDto(game)));
  };

  test('Play a game to conclusion', () => {
    const player1 = new Player();
    const player2 = new Player();

    game.addPlayer(player1);
    game.addPlayer(player2);

    while (game.status !== GameStatus.ENDED) {
      for (let i = 0; i < 36; i++) {
        if (game.whoseTurn) {
          playCard(game.whoseTurn);
          continue;
        }
        throw new NotThisPlayersTurnError();
      }
    }

    console.log(
      `Player 1 (${game.score(game.hands[0].player)} - ${game.score(
        game.hands[1].player,
      )}) Player 2`,
    );
    expect(game.moves.length).not.toBeLessThan(36);
    expect(game.roundsPlayed).toBeGreaterThan(0);
    expect(
      game.score(game.hands[0].player) >= 11 ||
        game.score(game.hands[1].player) >= 11,
    ).toBeTruthy();
  });
});
