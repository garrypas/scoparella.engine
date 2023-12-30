export enum PlayCardValidationResult {
  OK = 'OK',
  INVALID = 'Invalid move',
  TABLE_MISSING_REQUESTED_CARDS = 'Attempt to take one or more cards that were not on the table',
  CANNOT_TAKE_MANY_BECAUSE_EXACT_MATCH_ON_TABLE = 'Cannot take sum of face values when an exact match is on the table',
  CANNOT_LAY_CARD_MATCH_EXISTS = 'Cannot lay the card on the table without taking because a match exists',
  FACE_VALUES_DO_NOT_MATCH = 'The face value of the card played does not equal the sum of face values of the cards requested for capture',
}
