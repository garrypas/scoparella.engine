import { Game } from "../../src/Game";
import { Player } from "../../src/models/Player";
import { Card } from "../../src/models/Card";
import { Hand } from "../../src/models/Hand";
import { expect } from "chai";
import { GameStatus } from "../../src/models/GameStatus";
import { NotThisPlayersTurnError } from "../exceptions";

function getExactMatch(cardInHand: Card, cardsOnTable: Card[]): Card | undefined {
    return cardsOnTable.find(cardOnTable => cardOnTable.faceEquals(cardInHand));
  }

function getSumMatch(cardInHand: Card, cardsOnTable: Card[]): Card[] | undefined {
    return cardInHand.getFaceSumMatches(cardsOnTable)[0] || undefined;
}

function determineWhichCardsIfAnyCanBeTakenWithAGivenCardInHand(cardInHand: Card, cardsOnTable: Card[]): Card[] {
    const exactMatch = getExactMatch(cardInHand, cardsOnTable);
    if(exactMatch) {
        return [ exactMatch ];
    }
    const sumMatch = getSumMatch(cardInHand, cardsOnTable);
    if(sumMatch) {
        return sumMatch;
    }
    return [];
}

describe.only("Game acceptance tests", () => {
    let _game: Game;
    beforeEach(() => {
        _game = new Game({
            numberOfPlayers: 2
        })
    });

    const playCard = (hand: Hand) => {
        const card = hand.cards[0];
        const cardsThatCanBeTaken = determineWhichCardsIfAnyCanBeTakenWithAGivenCardInHand(card, _game.table.cards);
        _game.tryPlayCards(card, cardsThatCanBeTaken, hand);
        // Go through serialization loop to ensure game does not depend on object
        // references that might break during serialization/deserialization:
        _game = Game.fromJson(JSON.stringify(Game.toDto(_game)));
    };

    it("Play a game to conclusion", () => {
        const player1 = new Player();
        const player2 = new Player();

        _game.addPlayer(player1);
        _game.addPlayer(player2);

        while(_game.status !== GameStatus.ENDED) {
            for(let i = 0; i < 36; i++) {
                if(_game.whoseTurn) {
                    playCard(_game.whoseTurn);
                    continue;
                }
                throw new NotThisPlayersTurnError();
            }
        }

        console.log(`Player 1 (${_game.score(_game.hands[0].player)} - ${_game.score(_game.hands[1].player)}) Player 2`);
        expect(_game.moves).not.to.have.length.lessThan(36);
        expect(_game.roundsPlayed).to.be.greaterThan(0);
        expect(_game.score(_game.hands[0].player) >= 11 || _game.score(_game.hands[1].player) >= 11).to.be.true
    });
});