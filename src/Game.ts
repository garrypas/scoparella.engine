"use strict";

import { Deck } from "./models/Deck";
import { GameConfig } from "./GameConfig";
import { GameStatus } from "./models/GameStatus";
import { Player } from "./models/Player";
import { Hand } from "./models/Hand";
import { Table } from "./models/Table";
import { Card } from "./models/Card";
import { Scoreboard } from "./scoring/Scoreboard";
import { RuleEngine } from "./rules/RuleEngine";
import { PlayCardValidationResult } from "./rules/PlayCardValidationResult";
import { fromJson } from "./utils/fromJson";
import { IGameDto } from "./dtos/IGameDto";

export class Game {
    private _deck: Deck;
    private _numberOfPlayers: number;
    private _hands: Hand[];
    private _table: Table;
    private _lastTaker: Hand | undefined;
    private _whoseTurn: Hand | undefined;
    private _scoreboard: Scoreboard;
    private _ruleEngine: RuleEngine;
    private _roundsPlayed: number;

    constructor(config: GameConfig) {
        this._deck = new Deck();
        this._numberOfPlayers = config.numberOfPlayers;
        this._hands = [];
        this._table = new Table();
        this._scoreboard = config.scoreboard || new Scoreboard();
        this._ruleEngine = config.ruleEngine || new RuleEngine();
        this._roundsPlayed = 0;
    }

    get deck() : Deck {
        return this._deck;
    }

    get hands(): Hand[] {
        return this._hands.slice();
    }

    get table(): Table {
        return this._table;
    }

    get lastTaker(): Hand | undefined {
        return this._lastTaker;
    }

    scopas(player: Player): Card[] {
        return this._scoreboard.getScopas(player);
    }

    score(player: Player): number {
        return this._scoreboard.score(player);
    }

    get roundsPlayed(): number {
        return this._roundsPlayed;
    }

    get whoseTurn(): Hand | undefined {
        return this._whoseTurn;
    }

    get status(): GameStatus {
        let status = GameStatus.READY_TO_START;
        if(this._hands.length !== this._numberOfPlayers) {
            status = GameStatus.WAITING_FOR_PLAYERS;
        }
        if(this._deck.length === 0 && this._table.length === 0) {
            status = GameStatus.ENDED;
        }
        if(this._deck.length < 40 && !this._hands.every(h => h.cards.length === 0)) {
            status = GameStatus.IN_PROGRESS;
        }
        return status;
    }

    private dealRoundOfCardsToEachPlayer() {
        this._hands.forEach(hand => hand.add(this._deck.take(3)));
    }

    private start() {
        this.dealRoundOfCardsToEachPlayer();
        this.flop4CardsOnTable();
    }

    private flop4CardsOnTable() {
        this._table.flop(this.deck.take(4));
    }

    private playCardsPreCheck(cardToPlay: Card, cardsToTake: Card[], hand: Hand) {
        if (!this._whoseTurn || !hand.equals(this._whoseTurn)) {
            throw new Error(NOT_THIS_PLAYERS_TURN);
        }
        if (!hand.hasCard(cardToPlay)) {
            throw new Error(`Could not play ${cardToPlay.face} of ${cardToPlay.suit}. It is not in this player's hand.`);
        }
        const validationResult = this._ruleEngine.validPlay(cardToPlay, cardsToTake, this._table.cards);
        if(validationResult !== PlayCardValidationResult.OK) {
            throw new Error(validationResult);
        }
    }

    tryPlayCards(cardToPlay: Card, cardsToTake: Card[], hand: Hand) {
        this.playCardsPreCheck(cardToPlay, cardsToTake, hand);
        this.playCards(cardToPlay, cardsToTake, hand);

        this.checkForScopa(cardToPlay, cardsToTake, this._table.cards, hand);

        this.moveTurnToNextPlayer();

        if(this.allHandsAreEmpty() && this._deck.length === 0) {
            this.giveTableToLastTaker();
            this.updateScorecard();
            this.endRound();
        }
    }

    private playCards(cardToPlay: Card, cardsToTake: Card[], hand: Hand) {
        hand.capture(this._table.remove(cardsToTake));
        const removed = hand.remove(cardToPlay);
        if (cardsToTake.length > 0) {
            hand.capture(removed);
        }
        else {
            this._table.add(removed);
        }

        if (cardsToTake.length > 0) {
            this._lastTaker = hand;
        }

        if (this.allHandsAreEmpty() && this._deck.length > 0) {
            this.dealRoundOfCardsToEachPlayer();
        }
    }

    private checkForScopa(cardToPlay: Card, cardsToTake: Card[], cardsOnTable: Card[], hand: Hand) {
        if(this._ruleEngine.isScopa(cardsToTake, cardsOnTable)) {
            this._scoreboard.addScopa(hand.player, cardToPlay);
        }
    }

    private moveTurnToNextPlayer() {
        let playerIndex = this._hands.findIndex(hand => this.whoseTurn && hand.equals(this.whoseTurn)) + 1;
        if(playerIndex >= this._hands.length) {
            playerIndex = 0;
        }
        this._whoseTurn = this.hands[playerIndex];
    }

    private allHandsAreEmpty(): boolean {
        return this._hands.every(hand => hand.cards.length === 0);
    }

    private giveTableToLastTaker() {
        this._lastTaker?.capture(this._table.removeAll());
    }

    private updateScorecard() {
        this._scoreboard.calculateScores(this._hands);
    }

    private get completed(): boolean {
        const playersWithScoresOver11 = this.hands.map(h => this._scoreboard.score(h.player)).filter(s => s >= 11);
        if(playersWithScoresOver11.length < 1) {
            return false;
        }
        return playersWithScoresOver11.filter(s => s === Math.max(...playersWithScoresOver11)).length === 1;
    }

    private endRound() {
        this._roundsPlayed++;
        if(!this.completed) {
            this.moveTurnToNextPlayer();
            this._deck = new Deck();
            this.start();
        }
    }

    addPlayer(player: Player) {
        if(this._hands.length + 1 > this._numberOfPlayers) {
            throw new Error(CANNOT_ADD_MORE_PLAYERS_ERROR);
        }
        this._hands.push(new Hand(player));
        this._scoreboard.add(player);
        if(this._hands.length == this._numberOfPlayers) {
            this._whoseTurn = this._hands[0];
            this.start();
        }
    }

    static fromJson(json: string): Game {
        return fromJson(json, gameObj => {
            return this.fromDto(gameObj)
        });
    }

    static fromDto(jsonObj: IGameDto): Game {
        const game = new Game({
            numberOfPlayers: jsonObj.numberOfPlayers,
            scoreboard: Scoreboard.fromDto(jsonObj.scoreboard)
        });
        game._deck = Deck.fromDto(jsonObj.deck);
        game._hands = Hand.fromDtoArray(jsonObj.hands);
        game._table = Table.fromDto(jsonObj.table);
        if(jsonObj.lastTaker) {
            game._lastTaker = Hand.fromDto(jsonObj.lastTaker);
        }
        game._roundsPlayed = jsonObj.roundsPlayed;
        if(jsonObj.whoseTurn) {
            game._whoseTurn = Hand.fromDto(jsonObj.whoseTurn);
        }
        game._numberOfPlayers = jsonObj.numberOfPlayers;
        return game;
    }

    static toDto(obj: Game): IGameDto {
        return {
            deck: Deck.toDto(obj._deck),
            hands: Hand.toDtoArray(obj._hands),
            lastTaker: obj._lastTaker ? Hand.toDto(obj._lastTaker): undefined,
            numberOfPlayers: obj._numberOfPlayers,
            roundsPlayed: obj._roundsPlayed,
            scoreboard: Scoreboard.toDto(obj._scoreboard),
            table: Table.toDto(obj._table),
            whoseTurn: obj._whoseTurn ? Hand.toDto(obj._whoseTurn): undefined
        };
    }
}

export const CANNOT_ADD_MORE_PLAYERS_ERROR = "Cannot add more players, the game is full";
export const NOT_THIS_PLAYERS_TURN = "It is not this player's turn yet";