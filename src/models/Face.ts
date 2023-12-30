export enum Face {
  Ace = 'Ace',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
  Six = 'Six',
  Seven = 'Seven',
  Knave = 'Knave',
  Knight = 'Knight',
  King = 'King',
}

const faceValues = Object.values(Face);

export function getFaceValue(face: Face): number {
  return faceValues.findIndex((f) => f === face) + 1;
}
