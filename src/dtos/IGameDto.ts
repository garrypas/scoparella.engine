import { IDeckDto } from "./IDeckDto";
import { IHandDto } from "./IHandDto";
import { ITableDto } from "./ITableDto";
import { IScoreboardDto } from "./IScoreboardDto";

export interface IGameDto {
    deck: IDeckDto;
    numberOfPlayers: number;
    hands: IHandDto[];
    table: ITableDto;
    lastTaker: IHandDto | undefined;
    whoseTurn: IHandDto | undefined;
    scoreboard: IScoreboardDto;
    roundsPlayed: number;
}