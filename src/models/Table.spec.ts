import { Table } from './Table';
import { Card } from './Card';
import { Face } from './Face';
import { Suit } from './Suit';
import { ComparableArray } from '../core/ComparableArray';
import { CardsNotOnTableError } from '../exceptions';

describe('Table tests', () => {
  let table: Table;
  let card1: Card, card2: Card, card3: Card, card4: Card;

  beforeEach(() => {
    card1 = new Card(Face.Ace, Suit.Clubs);
    card2 = new Card(Face.Two, Suit.Coins);
    card3 = new Card(Face.Three, Suit.Cups);
    card4 = new Card(Face.Four, Suit.Swords);
    table = new Table();
    table.flop([card1, card2, card3, card4]);
  });

  test('Flop is laid on table', () => {
    expect(table.cards).toHaveLength(4);
    expect(table.cards[0]).toEqual(card1);
    expect(table.cards[1]).toEqual(card2);
    expect(table.cards[2]).toEqual(card3);
    expect(table.cards[3]).toEqual(card4);
  });

  test('remove() returns the correct cards from table', () => {
    const result: Card[] = table.remove([
      new Card(card1.face, card1.suit),
      new Card(card2.face, card2.suit),
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].equals(card1)).toBeTruthy();
    expect(result[1].equals(card2)).toBeTruthy();
  });

  test('remove() the cards remaining on the table are correct', () => {
    table.remove([
      new Card(card1.face, card1.suit),
      new Card(card2.face, card2.suit),
    ]);
    expect(table).toHaveLength(2);
    expect(table.cards[0].equals(card3)).toBeTruthy();
    expect(table.cards[1].equals(card4)).toBeTruthy();
  });

  test("remove() throws error if the card isn't on the table", () => {
    expect(() => table.remove(new Card(Face.Five, Suit.Clubs))).toThrow(
      CardsNotOnTableError,
    );
  });

  test('removeAll() removes all cards from the table', () => {
    table.removeAll();
    expect(table.cards).toHaveLength(0);
  });

  test('removeAll() returns cards removed', () => {
    const removed = table.removeAll();
    expect(removed).toHaveLength(4);
  });

  test('add() adds a card to the cards on the table', () => {
    const card5: Card = new Card(Face.Two, Suit.Clubs);
    table.add(card5);
    expect(table.cards).toHaveLength(5);
    expect(table.cards).toContain(card5);
  });

  test('add() throws error if the card is already on the table', () => {
    expect(() => table.add(card1)).toThrow(
      `The card with the face ${card1.face} and suit ${card1.suit} is already on the table`,
    );
  });

  test('fromDto() makes a copy of the Table instance', () => {
    const card5: Card = new Card(Face.Two, Suit.Clubs);
    table.add(card5);
    const tableAfter = Table.fromDto(Table.toDto(table));
    expect(
      ComparableArray.allMatch(tableAfter.cards, table.cards),
    ).toBeTruthy();
  });
});
