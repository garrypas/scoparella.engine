import { Scoreboard } from './scoring/Scoreboard';
import { RuleEngine } from './rules/RuleEngine';

export interface GameConfig {
  numberOfPlayers: number;
  scoreboard?: Scoreboard;
  ruleEngine?: RuleEngine;
}
