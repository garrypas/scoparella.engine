import { Player } from "../models/Player";
import { expect } from "chai";
import { IdGenerator } from "../utils/IdGenerator";
import { createSandbox, SinonSandbox } from "sinon";

describe("Player tests", () => {
    let _sandbox: SinonSandbox;

    beforeEach(() =>  _sandbox = createSandbox());
    afterEach(() => _sandbox.restore());

    it("new(id) - defined id is set", () => {
        const player = new Player("xyz");
        expect(player.id).to.equal("xyz");
    })

    describe("generateId()", () => {
        let _player: Player;
        const FAKE_ID = "00001111-2222-3333-4444-555566667777";

        beforeEach(() => {
            _sandbox = createSandbox();
            _sandbox.stub(IdGenerator, "generateId").callsFake(() => FAKE_ID || "");
            _player = new Player();
        });

        it("Generates an Id for the player", () => {
            expect(_player.id).to.equal(FAKE_ID);
        });
    });

    describe("equals()", () => {
        let _player1: Player;
        let _player1Copy: Player;
        let _player2: Player;

        beforeEach(() => {
            const ids = ["p2", "p1", "p1"];
            _sandbox.stub(IdGenerator, "generateId").callsFake(() => ids.pop() || "");
            [ _player1, _player1Copy, _player2 ] = [ new Player(), new Player(), new Player() ];
        });

        it("is true when players match", () => {
            expect(_player1.equals(_player1Copy)).to.be.true;
        });

        it("is false when players do not match", () => {
            expect(_player1.equals(_player2)).not.to.be.true;
        });
    });

    it("fromDto/toDto() serializes/deserializes the Player instance", () => {
        const player = new Player();
        const playerAfter = Player.fromDto(Player.toDto(player));
        expect(playerAfter.id).equal(player.id);
    });
});