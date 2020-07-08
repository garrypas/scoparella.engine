
import { 
    CANNOT_ADD_MORE_PLAYERS_ERROR,
    NOT_THIS_PLAYERS_TURN,
    Game,
} from "./Game";
import { expect } from "chai";
import { Player } from "./models/Player";
import { GameStatus } from "./models/GameStatus";
import { GameBuilder } from "./test-utils/GameBuilder";
import { CARDS_NOT_ON_TABLE } from "./models/Table";
import { RuleEngine } from "./rules/RuleEngine";
import { SinonSpy, SinonSandbox, createSandbox } from "sinon";
import { PlayCardValidationResult } from "./rules/PlayCardValidationResult";

describe("Game tests", () => {
    let _ruleEngine: RuleEngine;
    let _isScopaSpy: SinonSpy;
    let _validTakeSpy: SinonSpy;
    let _sandbox: SinonSandbox;
    let _gameBuilder: GameBuilder;
    let _isScopaResult: boolean;
    let _takeValidationResult: PlayCardValidationResult;

    beforeEach(() => {
        _sandbox = createSandbox();
        _ruleEngine = new RuleEngine();
        _takeValidationResult = PlayCardValidationResult.OK;
        _validTakeSpy = _sandbox.stub(_ruleEngine, "validPlay").callsFake(() => _takeValidationResult);
        _isScopaResult = false;
        _isScopaSpy = _sandbox.stub(_ruleEngine, "isScopa").callsFake(() => _isScopaResult);
        _gameBuilder = new GameBuilder().withRuleEngine(_ruleEngine);
    })

    afterEach(() => {
        _sandbox.restore();
    });

    it("Not ready when there are not enough players", () => {
        const game = _gameBuilder.addOnePlayer().build();
        expect(game.status).to.equal(GameStatus.WAITING_FOR_PLAYERS);
    });

    it("In progress when cards have been dealt but some are on the deck", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(game.status).to.equal(GameStatus.IN_PROGRESS);
    });

    it("In progress when all cards have been dealt but some are on the table", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(game.status).to.equal(GameStatus.IN_PROGRESS);
    });

    it("Not ended when cards remain in hand", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playHands(17)
            .build();
        expect(game.status).not.to.equal(GameStatus.ENDED);
    });

    it("In progress when all cards are dealt and none are on the table but round is not complete", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.status).to.equal(GameStatus.IN_PROGRESS);
    });

    it("Still in progress when all cards are dealt and none are on the table and round is complete", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .gameCompleted()
            .build();
        expect(game.status).to.equal(GameStatus.IN_PROGRESS);
    });

    it("When round is ended the first player is rotated for the next round", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.whoseTurn?.equals(game.hands[0])).not.to.be.true;
        expect(game.whoseTurn?.equals(game.hands[1])).to.be.true;
    });

    it("When round is ended the number of rounds played is increased by 1", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.roundsPlayed).to.equal(1);
    });

    it("When round is not ended the number of rounds played is not increased", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playHands(17)
            .build();
        expect(game.roundsPlayed).to.equal(0);
    });

    it("Returns scores", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.score(game.hands[0].player)).not.to.be.undefined;
        expect(game.score(game.hands[1].player)).not.to.be.undefined;
    });

    it("When round is ended the deck is replenished ready for the next game", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.deck).to.have.lengthOf(30);
    });

    it("When game is ended cards are dealt to each player ready for the next round", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.hands[0].cards).to.have.lengthOf(3);
        expect(game.hands[1].cards).to.have.lengthOf(3);
    });

    it("When game is ended captured cards are reset to zero", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playToEnd()
            .build();
        expect(game.hands[0].captured).to.be.empty;
        expect(game.hands[1].captured).to.be.empty;
    });

    it("Gives cards remaining on table to the last taker", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .build();

        for(let i = 0; i < 18; i++) {
            game.tryPlayCards(game.hands[0].cards[0], [ ], game.hands[0]);
            if(i === 0) {
                const [ knightOfCups, knightOfSwords ] = [ game.hands[1].cards[2], game.table.cards[0] ];
                game.tryPlayCards(knightOfCups, [ knightOfSwords ], game.hands[1]);
            } else{
                game.tryPlayCards(game.hands[1].cards[0], [ ], game.hands[1]);
            }
        }
        expect(game.hands[1].captured).to.be.lengthOf(40);
    });

    it("Deals 3 cards to each player once the game is ready to begin", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(game.hands[0].cards).to.have.lengthOf(3);
        expect(game.hands[1].cards).to.have.lengthOf(3);
    });

    it("Leaves 30 cards on the deck once cards have been dealt to players at the start of the game", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(game.deck.cards).to.have.lengthOf(30);
    });

    it("Flops 4 cards on the table at the start of the game", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(game.table.cards).to.have.lengthOf(4);
    });

    it("When game is ready to start player 1 goes first", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(game.whoseTurn).to.equal(game.hands[0]);
    });

    it("Player cannot play until it is their turn", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(() =>
            game.tryPlayCards(game.hands[1].cards[0], [ ], game.hands[1]),
        ).to.throw(NOT_THIS_PLAYERS_TURN);
    });

    it("Moves turn to next player", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        game.tryPlayCards( game.hands[0].cards[0], [  ], game.hands[0]);
        expect(game.whoseTurn?.equals(game.hands[1])).to.be.true;
    });

    it("Moves turn to first player when last player has gone", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        game.tryPlayCards( game.hands[0].cards[0], [  ], game.hands[0]);
        game.tryPlayCards( game.hands[1].cards[0], [  ], game.hands[1]);
        expect(game.whoseTurn?.equals(game.hands[0])).to.be.true;
    });

    it("Takes requested cards when request is valid", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        game.tryPlayCards(game.hands[0].cards[0], [ ], game.hands[0]);

        const knightOfCups = game.hands[1].cards[2];
        const knightOfSwords = game.table.cards[0];
        game.tryPlayCards(knightOfCups, [ knightOfSwords ], game.hands[1]);

        expect(game.hands[1].cards).not.to.contain(knightOfCups);
        expect(game.hands[1].captured).to.contain(knightOfCups);
        expect(game.hands[1].captured).to.contain(knightOfSwords);
        expect(game.table.cards).not.to.contain(knightOfSwords);
    });

    it("Fails to take requested cards when they are not on the table", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(() => game.tryPlayCards(game.hands[0].cards[0], [ game.hands[0].cards[0] ], game.hands[0])).to.throw(CARDS_NOT_ON_TABLE);
    });

    it("Puts card on table if it cannot be used to capture", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        const kingOfClubs = game.hands[0].cards[0];
        game.tryPlayCards(kingOfClubs, [ ], game.hands[0]);
        expect(game.hands[1].cards).not.to.contain(kingOfClubs);
        expect(game.table.cards).to.contain(kingOfClubs);
    });

    it("Throws error when trying to add more players than the maximum number the game can accept", () => {
        const game = _gameBuilder.addTwoPlayers().build();
        expect(() => game.addPlayer(new Player())).to.throw(CANNOT_ADD_MORE_PLAYERS_ERROR);
    });

    it("Deals next round when each player's hand is empty", () => {
        const game = _gameBuilder
            .addTwoPlayers()
            .playSingleRound()
            .build();
        expect(game.deck).to.have.lengthOf(24);
        expect(game.hands[0].cards).to.be.lengthOf(3);
        expect(game.hands[1].cards).to.be.lengthOf(3);
    });

    it("Checks for scopa after each card is played", () => {
        _gameBuilder
            .addTwoPlayers()
            .playSingleRound()
            .build();
        expect(_isScopaSpy.callCount).to.be.equal(6);
    });

    it("If round results in a scopa the scopa is counted", () => {
        _isScopaResult = true;
        const game = _gameBuilder
            .addTwoPlayers()
            .playSingleRound()
            .build();
        expect(game.scopas(game.hands[0].player)).to.be.lengthOf(3);
        expect(game.scopas(game.hands[1].player)).to.be.lengthOf(3);
    });

    it("Checks if move is valid", () => {
        _gameBuilder
            .addTwoPlayers()
            .playSingleRound()
            .build();
        expect(_validTakeSpy.callCount).to.be.equal(6);
    });

    it("Throws and error if move is not valid", () => {
        _takeValidationResult = PlayCardValidationResult.INVALID;
        const game = _gameBuilder
            .addTwoPlayers()
            .build();
        expect(() => game.tryPlayCards(game.hands[0].cards[0], game.table.cards, game.hands[0])).to.throw(PlayCardValidationResult.INVALID);
    });

    it("JSON serialization/deserialization", () => {
        const gameBefore = _gameBuilder
            .addTwoPlayers()
            .playHands(2)
            .build();
        const gameAfter: Game = Game.fromDto(Game.toDto(gameBefore));
        expect(gameAfter.deck).not.to.be.undefined;
        expect(gameAfter.hands).not.to.be.undefined;
        expect(gameAfter.lastTaker).to.equal(gameBefore.lastTaker);
        expect(gameAfter.roundsPlayed).to.equal(gameBefore.roundsPlayed);
        expect(gameAfter.status).not.to.be.undefined;
        expect(gameAfter.status).to.equal(GameStatus.IN_PROGRESS);
        expect(gameAfter.table).not.to.be.undefined;
        expect(gameAfter.table).to.have.lengthOf(gameBefore.table.cards.length);
        expect(gameAfter.whoseTurn).not.to.be.undefined;
    });
});