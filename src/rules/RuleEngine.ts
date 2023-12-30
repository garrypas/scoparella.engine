import { Card } from '../models/Card';
import { PlayCardValidationResult } from './PlayCardValidationResult';
import { getFaceValue } from '../models/Face';
import { ComparableArray } from '../core/ComparableArray';

export class RuleEngine {
  validPlay(
    cardToPlay: Card,
    cardsToTake: Card[],
    cardsOnTable: Card[],
  ): PlayCardValidationResult {
    if (!ComparableArray.isSubset(cardsToTake, cardsOnTable)) {
      return PlayCardValidationResult.TABLE_MISSING_REQUESTED_CARDS;
    }
    return cardsToTake.length > 0
      ? taking(cardToPlay, cardsToTake, cardsOnTable)
      : playing(cardToPlay, cardsOnTable);
  }

  isScopa(cardsToTake: Card[], cardsOnTable: Card[]) {
    return cardsToTake.length > 0 && cardsOnTable.length < 1;
  }
}

function taking(
  cardToPlay: Card,
  cardsToTake: Card[],
  cardsOnTable: Card[],
): PlayCardValidationResult {
  return cardsToTake.length === 1
    ? takingOne(cardToPlay, cardsToTake, cardsOnTable)
    : takingMany(cardToPlay, cardsToTake, cardsOnTable);
}

function takingOne(
  cardToPlay: Card,
  cardsToTake: Card[],
  cardsOnTable: Card[],
): PlayCardValidationResult {
  if (!isExactMatch(cardToPlay, cardsToTake)) {
    return PlayCardValidationResult.FACE_VALUES_DO_NOT_MATCH;
  }
  return PlayCardValidationResult.OK;
}

function takingMany(
  cardToPlay: Card,
  cardsToTake: Card[],
  cardsOnTable: Card[],
): PlayCardValidationResult {
  if (exactMatchExists(cardToPlay, cardsOnTable)) {
    return PlayCardValidationResult.CANNOT_TAKE_MANY_BECAUSE_EXACT_MATCH_ON_TABLE;
  }
  if (!sumOfFacesMatches(cardToPlay, cardsToTake)) {
    return PlayCardValidationResult.FACE_VALUES_DO_NOT_MATCH;
  }
  return PlayCardValidationResult.OK;
}

function playing(
  cardToPlay: Card,
  cardsOnTable: Card[],
): PlayCardValidationResult {
  if (exactMatchExists(cardToPlay, cardsOnTable)) {
    return PlayCardValidationResult.CANNOT_LAY_CARD_MATCH_EXISTS;
  }
  if (cardToPlay.getFaceSumMatches(cardsOnTable).length > 0) {
    return PlayCardValidationResult.CANNOT_LAY_CARD_MATCH_EXISTS;
  }
  return PlayCardValidationResult.OK;
}

function exactMatchExists(cardToPlay: Card, cardsOnTable: Card[]): boolean {
  return (
    cardsOnTable.findIndex((cardOnTable) =>
      cardOnTable.faceEquals(cardToPlay),
    ) >= 0
  );
}

function isExactMatch(cardToPlay: Card, cardsToTake: Card[]): boolean {
  return cardsToTake.length === 1 && cardToPlay.faceEquals(cardsToTake[0]);
}

function sumOfFacesMatches(cardToPlay: Card, cardsToTake: Card[]) {
  return getFaceValue(cardToPlay.face) === Card.sumFaces(cardsToTake);
}
