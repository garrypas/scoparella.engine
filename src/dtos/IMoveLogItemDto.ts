import { ICardDto } from "./ICardDto"
import { IPlayerDto } from "./IPlayerDto";

export interface IMoveLogItemDto {
    card: ICardDto;
    taken: ICardDto[];
    timestamp: string;
    player: IPlayerDto;
    isScopa: boolean;
}