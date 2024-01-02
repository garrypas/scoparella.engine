import { MoveLogItem } from './MoveLogItem';
import { Card } from './Card';
import { Face } from './Face';
import { Suit } from './Suit';
import { Player } from './Player';
import { ComparableArray } from '../core/ComparableArray';

describe('MoveLogItem tests', () => {
  describe('serialization/deserialization', () => {
    let moveLogItem: MoveLogItem[];

    beforeEach(
      () =>
        (moveLogItem = [
          new MoveLogItem(
            new Card(Face.Three, Suit.Clubs),
            [new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs)],
            '123',
            new Player(),
            true,
          ),
        ]),
    );

    [
      { fromMethod: 'fromDtoArray', toMethod: 'toDtoArray' },
      { fromMethod: 'fromDto', toMethod: 'toDto' },
    ].forEach((testData) =>
      describe(`${testData.fromMethod}/${testData.toMethod}() serializes/deserializes`, () => {
        let moveLogItemAfter: MoveLogItem[];

        beforeEach(() => {
          if (testData.fromMethod === 'fromDto') {
            moveLogItemAfter = [
              MoveLogItem.fromDto(MoveLogItem.toDto(moveLogItem[0])),
            ];
          } else {
            moveLogItem.push(
              new MoveLogItem(
                new Card(Face.Three, Suit.Swords),
                [
                  new Card(Face.Ace, Suit.Swords),
                  new Card(Face.Two, Suit.Swords),
                ],
                '456',
                new Player(),
                false,
              ),
            );
            moveLogItemAfter = MoveLogItem.fromDtoArray(
              MoveLogItem.toDtoArray(moveLogItem),
            );
          }
        });

        test('serializes/deserializes length is correct', () =>
          expect(moveLogItemAfter).toHaveLength(moveLogItem.length));

        test('serializes/deserializes cards', () =>
          moveLogItemAfter.forEach((_, i) =>
            expect(
              moveLogItemAfter[i].card?.equals(moveLogItem[i].card!),
            ).toBeTruthy(),
          ));

        test('serializes/deserializes players', () =>
          moveLogItemAfter.forEach(
            (_, i) =>
              expect(moveLogItemAfter[i].player.equals(moveLogItem[i].player))
                .toBeTruthy,
          ));

        test('serializes/deserializes isScopa', () =>
          moveLogItemAfter.forEach((_, i) =>
            expect(moveLogItemAfter[i].isScopa).toEqual(moveLogItem[i].isScopa),
          ));

        test('serializes/deserializes taken elements', () =>
          moveLogItemAfter.forEach((_, i) =>
            expect(
              ComparableArray.allMatch(
                moveLogItemAfter[i].taken,
                moveLogItem[i].taken,
              ),
            ),
          ));

        test('serializes/deserializes timestamp', () =>
          moveLogItemAfter.forEach((_, i) =>
            expect(moveLogItemAfter[i].timestamp).toEqual(
              moveLogItem[i].timestamp,
            ),
          ));
      }),
    );
  });
});
