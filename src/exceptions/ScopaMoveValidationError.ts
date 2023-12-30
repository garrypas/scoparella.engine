import { PlayCardValidationResult } from '../rules/PlayCardValidationResult';

export class ScopaMoveValidationError extends Error {
  constructor(result: PlayCardValidationResult) {
    super(result);
  }
}
