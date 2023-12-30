export class PlayerAlreadyAddedError extends Error {
  constructor() {
    super(PLAYER_ALREADY_ADDED);
  }
}
export const PLAYER_ALREADY_ADDED =
  'You cannot add a player with this ID, a player with this ID is already in the game';
