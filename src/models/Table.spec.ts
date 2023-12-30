import { Table } from './Table';
import { Card } from './Card';
import { Face } from './Face';
import { Suit } from './Suit';
import { ComparableArray } from '../core/ComparableArray';
import { CardsNotOnTableError } from '../exceptions';

describe('Table tests', () => {
  let _table: Table;
  let _card1: Card, _card2: Card, _card3: Card, _card4: Card;

  beforeEach(() => {
    _card1 = new Card(Face.Ace, Suit.Clubs);
    _card2 = new Card(Face.Two, Suit.Coins);
    _card3 = new Card(Face.Three, Suit.Cups);
    _card4 = new Card(Face.Four, Suit.Swords);
    _table = new Table();
    _table.flop([_card1, _card2, _card3, _card4]);
  });

  test('Flop is laid on table', () => {
    expect(_table.cards).toHaveLength(4);
    expect(_table.cards[0]).toEqual(_card1);
    expect(_table.cards[1]).toEqual(_card2);
    expect(_table.cards[2]).toEqual(_card3);
    expect(_table.cards[3]).toEqual(_card4);
  });

  test('remove() returns the correct cards from table', () => {
    const result: Card[] = _table.remove([
      new Card(_card1.face, _card1.suit),
      new Card(_card2.face, _card2.suit),
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].equals(_card1)).toBeTruthy();
    expect(result[1].equals(_card2)).toBeTruthy();
  });

  test('remove() the cards remaining on the table are correct', () => {
    _table.remove([
      new Card(_card1.face, _card1.suit),
      new Card(_card2.face, _card2.suit),
    ]);
    expect(_table).toHaveLength(2);
    expect(_table.cards[0].equals(_card3)).toBeTruthy();
    expect(_table.cards[1].equals(_card4)).toBeTruthy();
  });

  test("remove() throws error if the card isn't on the table", () => {
    expect(() => _table.remove(new Card(Face.Five, Suit.Clubs))).toThrow(
      CardsNotOnTableError,
    );
  });

  test('removeAll() removes all cards from the table', () => {
    _table.removeAll();
    expect(_table.cards).toHaveLength(0);
  });

  test('removeAll() returns cards removed', () => {
    const removed = _table.removeAll();
    expect(removed).toHaveLength(4);
  });

  test('add() adds a card to the cards on the table', () => {
    const card5: Card = new Card(Face.Two, Suit.Clubs);
    _table.add(card5);
    expect(_table.cards).toHaveLength(5);
    expect(_table.cards).toContain(card5);
  });

  test('add() throws error if the card is already on the table', () => {
    expect(() => _table.add(_card1)).toThrow(
      `The card with the face ${_card1.face} and suit ${_card1.suit} is already on the table`,
    );
  });

  test('fromDto() makes a copy of the Table instance', () => {
    const card5: Card = new Card(Face.Two, Suit.Clubs);
    _table.add(card5);
    const tableAfter = Table.fromDto(Table.toDto(_table));
    expect(
      ComparableArray.allMatch(tableAfter.cards, _table.cards),
    ).toBeTruthy();
  });
});
