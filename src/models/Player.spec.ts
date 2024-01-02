import { Player } from '../models/Player';

let ids: string[];

jest.mock('../utils/IdGenerator', () => ({
  IdGenerator: {
    generateId: () => ids.pop() ?? '',
  },
}));

beforeEach(() => {
  ids = ['p3', 'p2', 'p1'];
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('Player tests', () => {
  test('new(id) - defined id is set', () => {
    const player = new Player('xyz');
    expect(player.id).toEqual('xyz');
  });

  describe('generateId()', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player();
    });

    test('Generates an Id for the player', () => {
      expect(player.id).toEqual('p1');
    });
  });

  describe('equals()', () => {
    let player1: Player;
    let player1Copy: Player;
    let player2: Player;

    beforeEach(() => {
      [player1, player1Copy, player2] = [
        new Player('p1'),
        new Player('p1'),
        new Player('p2'),
      ];
    });

    test('is true when players match', () => {
      expect(player1.equals(player1Copy)).toBeTruthy();
    });

    test('is false when players do not match', () => {
      expect(player1.equals(player2)).toBeFalsy();
    });
  });

  test('fromDto/toDto() serializes/deserializes the Player instance', () => {
    const player = new Player();
    const playerAfter = Player.fromDto(Player.toDto(player));
    expect(playerAfter.id).toEqual(player.id);
  });
});
