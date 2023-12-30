import { Face, Suit } from '..';

export class CardAlreadyOnTableError extends Error {
  constructor(face: Face, suit: Suit) {
    super(
      `The card with the face ${face} and suit ${suit} is already on the table`,
    );
  }
}
