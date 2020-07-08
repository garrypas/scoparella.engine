import { ICardDto } from "./ICardDto";
import { IPlayerDto } from "./IPlayerDto";

export interface IHandDto {
    cards: ICardDto[];
    player: IPlayerDto;
    captured: ICardDto[];
}