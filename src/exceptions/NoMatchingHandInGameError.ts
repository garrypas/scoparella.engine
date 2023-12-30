export class NoMatchingHandInGameError extends Error {
  constructor() {
    super(NO_MATCHING_HAND_IN_GAME_ERROR);
  }
}
export const NO_MATCHING_HAND_IN_GAME_ERROR =
  'Unable to find matching hand in Game state.';
