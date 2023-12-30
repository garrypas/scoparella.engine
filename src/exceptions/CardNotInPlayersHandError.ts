import { Face, Suit } from '..';

export class CardNotInPlayersHandError extends Error {
  constructor(face: Face, suit: Suit) {
    super(
      `Could not play ${face} of ${suit}. It is not in this player's hand.`,
    );
  }
}
