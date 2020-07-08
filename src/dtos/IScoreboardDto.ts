import { IScoreDto } from "./IScoreDto";
import { ICardDto } from "./ICardDto";

export interface IScoreboardDto {
    scores: IScoreDto[];
    scopas: ICardDto[][];
}