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
    let _player: Player;

    beforeEach(() => {
      _player = new Player();
    });

    test('Generates an Id for the player', () => {
      expect(_player.id).toEqual('p1');
    });
  });

  describe('equals()', () => {
    let _player1: Player;
    let _player1Copy: Player;
    let _player2: Player;

    beforeEach(() => {
      [_player1, _player1Copy, _player2] = [
        new Player('p1'),
        new Player('p1'),
        new Player('p2'),
      ];
    });

    test('is true when players match', () => {
      expect(_player1.equals(_player1Copy)).toBeTruthy();
    });

    test('is false when players do not match', () => {
      expect(_player1.equals(_player2)).toBeFalsy();
    });
  });

  test('fromDto/toDto() serializes/deserializes the Player instance', () => {
    const player = new Player();
    const playerAfter = Player.fromDto(Player.toDto(player));
    expect(playerAfter.id).toEqual(player.id);
  });
});
