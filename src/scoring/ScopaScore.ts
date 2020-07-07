import { Player } from "../models/Player";
import { Card } from "../models/Card";
import { Score } from "../models/Score";

export class ScopaScore {
    static scoreScopas(players: Player[], scopas: Card[][]) : Score[] {
        return players.map((player, index) => {
            const numberOfScopas = scopas[index].length;
            scopas[index].splice(0, scopas.length);
            return new Score(player, numberOfScopas)
        });
    }
}