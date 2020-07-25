export class CannotAddMorePlayersError extends Error {
    constructor() { super(CANNOT_ADD_MORE_PLAYERS_ERROR); }
}
export const CANNOT_ADD_MORE_PLAYERS_ERROR = "Cannot add more players, the game is full";
