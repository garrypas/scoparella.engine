export class CardsNotOnTableError extends Error {
  constructor() {
    super(CARDS_NOT_ON_TABLE);
  }
}
export const CARDS_NOT_ON_TABLE =
  'Failed to remove cards. Some of the cards were not on the table';
