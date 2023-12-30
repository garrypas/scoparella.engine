export class NotThisPlayersTurnError extends Error {
  constructor() {
    super(NOT_THIS_PLAYERS_TURN);
  }
}
export const NOT_THIS_PLAYERS_TURN = "It is not this player's turn yet";
