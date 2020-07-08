
import { Scoreboard } from "./Scoreboard";
import { Player } from "../models/Player";
import { expect } from "chai";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { Hand } from "../models/Hand";
import { IScoreCalculator } from "./IScoreCalculator";
import { ScopaScore } from "./ScopaScore";
import { Score } from "../models/Score";
import { SinonSpy, createSandbox, SinonSandbox } from "sinon";

describe("Scoreboard tests", () => {
    let _calculateScoreSpy: SinonSpy<Hand[][], Score[]>;
    let _scoreboard: Scoreboard;
    let _scoresToReturn: number[];
    let _scopaScoreSpy: SinonSpy<[Player[], Card[][]], Score[]>;
    let _sandbox: SinonSandbox;

    beforeEach(() => {
        _sandbox = createSandbox();
        _scoresToReturn = [0, 1];
        const scoreCalculator = {
            calculateScores: (hands: Hand[]): Score[] => {
                return hands.map((hand, idx) => new Score(hand.player, _scoresToReturn[idx]));
            }
        } as IScoreCalculator;
        _calculateScoreSpy = _sandbox.spy(scoreCalculator, "calculateScores");
        _scopaScoreSpy = _sandbox.spy(ScopaScore, "scoreScopas");
        _scoreboard = new Scoreboard([scoreCalculator])
    });

    afterEach(() => {
        _sandbox.restore();
    });

    it("add() adds player", () => {
        _scoreboard.add(new Player());
        _scoreboard.add(new Player());
        expect(_scoreboard.length).to.equal(2);
    });

    it("addScopa() increments scopa count", () => {
        const player = new Player();
        const card = new Card(Face.Ace, Suit.Coins);
        _scoreboard.add(player);
        _scoreboard.addScopa(player, card);
        const scopas = _scoreboard.getScopas(player);
        expect(scopas).to.be.lengthOf(1);
    });

    it("addScopa() adds a point to the score", () => {
        const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];
        _scoreboard.add(hand1.player);
        _scoreboard.add(hand2.player);
        _scoreboard.addScopa(hand2.player, new Card(Face.Ace, Suit.Clubs));
        const scores = _scoreboard.calculateScores([ hand1, hand2 ]);
        expect(scores[0].score).to.equal(0);
        expect(scores[1].score).to.equal(2);
    });

    it("clearScopas() clears scopas", () => {
        const player = new Player();
        const card = new Card(Face.Ace, Suit.Coins);
        _scoreboard.add(player);
        _scoreboard.addScopa(player, card);
        _scoreboard.clearScopas();
        expect(_scoreboard.getScopas(player)).to.be.empty;
    });

    it("calculateScore() calls score calculators", () => {
        const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];
        _scoreboard.add(hand1.player);
        _scoreboard.add(hand2.player);
        _scoreboard.calculateScores([hand1, hand2]);
        expect(_calculateScoreSpy.calledOnce).to.be.true;
    });

    it("calculateScore() scores scopas", () => {
        const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];
        _scoreboard.add(hand1.player);
        _scoreboard.add(hand2.player);
        _scoreboard.calculateScores([hand1, hand2]);
        expect(_scopaScoreSpy.calledOnce).to.be.true;
    });

    it("calculateScore() return scores only for this round", () => {
        const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];
        _scoreboard.add(hand1.player);
        _scoreboard.add(hand2.player);
        _scoreboard.calculateScores([ hand1, hand2 ]);
        const scoresForThisRound = _scoreboard.calculateScores([ hand1, hand2 ]);
        expect(scoresForThisRound.find(s => s.player.equals(hand1.player))?.score).to.equal(0);
        expect(scoresForThisRound.find(s => s.player.equals(hand2.player))?.score).to.equal(1);
    });

    it("score() returns scores", () => {
        const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];
        _scoreboard.add(hand1.player);
        _scoreboard.add(hand2.player);
        _scoreboard.calculateScores([ hand1, hand2 ]);
        expect(_scoreboard.score(hand1.player)).to.equal(0);
        expect(_scoreboard.score(hand2.player)).to.equal(1);
    });

    it("score() returns scores when multiple calculations have been performed", () => {
        const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];
        _scoreboard.add(hand1.player);
        _scoreboard.add(hand2.player);
        _scoreboard.calculateScores([ hand1, hand2 ]);
        _scoreboard.calculateScores([ hand1, hand2 ]);
        expect(_scoreboard.score(hand1.player)).to.equal(0);
        expect(_scoreboard.score(hand2.player)).to.equal(2);
    });
});