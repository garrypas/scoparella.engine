---
name: scopa-game
description: "Scopa rules, card values, captures, scoring, primiera, tactics, common variants, and this repository's Scopa engine behavior. Use when answering Scopa questions or designing, reviewing, testing, or implementing Scopa gameplay and rules."
user-invocable: true
---

# Scopa Game Reference

Use this skill for questions about Scopa (the Italian fishing card game), gameplay tactics, or rule-related work in this repository. Scopa has regional variations: state the ruleset and assumptions when they matter. For this engine, the source code is authoritative. If this skill or the README conflicts with the code, follow the code and report the discrepancy; do not silently change the implementation to match common tabletop rules.

## Common tabletop rules (context)

The following describes a common traditional 40-card game, not necessarily this engine's behavior. Repository-specific behavior and deviations are documented below and take precedence for code questions.

### Cards and values

- Use four suits: coins (denari), cups (coppe), swords (spade), and clubs/batons (bastoni). A traditional Italian deck has Ace through Seven and three court cards per suit.
- Capture values are Ace = 1, number cards = their number, Knave/Fante = 8, Knight/Cavallo = 9, and King/Re = 10.
- A French-suited substitute commonly removes the 8s, 9s, and 10s; map its remaining court cards to values 8, 9, and 10. Suit equivalents vary, so agree which suit represents coins.

### Deal and turn

- Scopa is commonly played by two players; three-player and partnership variants also exist. This repository's README describes 2–4 players, without specifying team play.
- Deal three cards to each player and four face up to the table. After everyone plays their hand, deal another three cards to each player, leaving the table cards in place. Continue until the deck and hands are exhausted.
- On a turn, play exactly one card. If it captures, collect that played card together with the captured table card(s); otherwise leave it face up on the table.
- An exact-value match captures one table card. If no exact match is available, a played card can capture a set of two or more table cards whose values sum to its value. When several sets sum to the value, choose one set.
- Capturing is compulsory when the played card can capture. If both an exact match and a sum-set match are available, the exact single card takes priority; do not capture the sum set instead. A legal non-capturing play is allowed when that played card has no capture, even if a different card in hand could capture.
- If a capture removes every card from the table, it is a _scopa_ (sweep), normally worth one point. The played card is traditionally turned sideways/up in the capture pile as a reminder.
- After the last deal, remaining table cards go to the player/team that most recently made a capture. This final collection is not itself a scopa. In the common rules described by Pagat, clearing the table with the final card of the final deal also does not score a scopa.

### Scoring and winning

In common Scopa, at the end of a deal (round), score each category independently:

- One point for the most captured cards; a tie scores no point.
- One point for the most captured coins/denari; a tie scores no point.
- One point for the settebello: the Seven of Coins.
- One point for the best _primiera_; a tie scores no point.
- One point for each scopa.

To calculate primiera, select each player's best captured card in each suit and sum its primiera value. A player needs at least one card in every suit to compete. The common scale is:

| Card                | Primiera value |
| ------------------- | -------------: |
| Seven               |             21 |
| Six                 |             18 |
| Ace                 |             16 |
| Five                |             15 |
| Four                |             14 |
| Three               |             13 |
| Two                 |             12 |
| Knave, Knight, King |             10 |

The common target is 11 points; a player/team must reach or exceed it and lead outright. If players tie for the lead at the target, play another deal to break the tie. Targets and primiera scales may vary by region or house rules.

## Common Scopa tactics

Offer practical principles, not guaranteed plays; the best move depends on the table, hand, remaining cards, and local rules.

- **Prioritize multi-category cards.** In common Scopa, the Seven of Coins contributes to the settebello, coins majority, and primiera, so securing it can affect several scoring categories. Other high primiera cards—especially sevens, sixes, and aces—are valuable too. This engine's default scoreboard does not currently score primiera; see the implementation notes below.
- **Track the scoring race.** Keep a rough count of captured cards and coins, and note high primiera cards already taken. A category already secured may change which capture is most valuable.
- **Compare capture sets.** If multiple sum sets are legal, consider the cards you gain, the cards you leave, whether you create an opponent's exact or sum capture, and whether you can empty the table for a scopa. The exact-match rule overrides a sum set.
- **Manage the table you leave.** When forced to lay a card, avoid creating an easy opponent sweep or a valuable capture where possible. Consider both individual table-card values and combinations that sum to cards likely still in opponents' hands.
- **Use known cards.** Remember played and captured cards to estimate which values and coins remain. This is especially useful for deciding whether to protect a primiera card or risk a capture.
- **Account for tempo and deal position.** A sweep empties the table, so the next player generally starts a new layout with a non-capturing play. Late in a deal, consider which player is likely to make the final capture and claim any residual table cards.
- **Don't confuse tactical preference with legality.** Under common Scopa rules, capture is compulsory if the played card has a capture; you may still choose a different card from your hand to play.

## Variants and assumptions

There is no single universal ruleset. Common variants include _Asso pigliatutto_ (an Ace sweeps the table subject to local conditions), _Scopone_ (different deal/hand structure), alternate target scores, and altered primiera or bonus scoring. Do not silently apply a variant. Ask which ruleset applies or clearly label the assumption. The basic rules in this skill do not include those variant mechanics.

## Repository-specific behavior (authoritative for this engine)

The README at `../../../README.md` is a summary, not the authority when it conflicts with implementation. Read the source and relevant tests for exact behavior. Tests describe coverage and may not cover every edge case.

Implemented behavior:

- `src/models/Face.ts` gives the capture values Ace = 1 through Seven = 7, Knave = 8, Knight = 9, King = 10. `src/models/Deck.ts` creates 40 cards across the four suits.
- `src/Game.ts` starts each game with three cards per player and four cards on the table. It deals three more to each player when their hands are empty and the deck still has cards. At the end of the final deal, it removes remaining table cards and gives them to `_lastTaker` if one is set.
- `GameConfig.numberOfPlayers` is caller-supplied. The README documents 2–4 players, but the engine does not validate that range; scoring and turns treat each `Player` separately, with no team abstraction.
- `src/rules/RuleEngine.ts` requires requested cards to be on the table, enforces exact-match priority over sum captures, and prevents laying the played card when that card has an exact or sum capture. Capture legality is based on the card being played, not whether another card in hand could capture.
- The default `Scoreboard` awards points for most captured cards, most Coins, the Seven of Coins, and recorded scopas. It does **not** include the implemented `PrimeScores` calculator, despite the README listing primiera. Do not describe primiera as part of default engine scoring.
- `Game.completed` ends the game when at least one player has 11 or more points and there is a unique highest score among players at or above 11. Otherwise, `endRound()` starts another deal.

Potential implementation bugs/deviations to flag, not repair unless explicitly asked:

- **Top-score ties:** `CardScoringComparison.getMost()` suppresses points only when every player ties. If two or more players tie for the highest count while another player has less, all top-tied players receive a point. Common Scopa awards no point for a tie for most cards, Coins, or primiera.
- **Incomplete primiera eligibility:** Although `PrimeScores` is not used by the default scoreboard, its implementation assigns zero for a missing suit and still compares the total. Common rules generally require a card in every suit to compete for primiera.
- **Final-play scopa:** `Game` checks for a scopa immediately after applying a move and before checking whether the deal has ended. Thus, a final-card sweep is recorded and scored, unlike the common rule described above.
- **Captured cards across deals:** When `endRound()` starts another deal, it does not clear each `Hand.captured`. The next round's card/coin scoring therefore sees cards from earlier rounds again, potentially scoring the same captured cards repeatedly.
- **Last taker across deals:** `_lastTaker` is not reset when a new deal starts. Remaining table cards can therefore be assigned to the previous deal's last taker if the current deal has no new capture.
- **Scopa counter reset:** `ScopaScore.scoreScopas()` removes at most `scopas.length` entries from each player's scopa list (`scopas.length` is the number of players). If a player records more scopas than there are players, excess entries remain and may be scored again.
- **No last taker:** `giveTableToLastTaker()` removes all remaining table cards even if `_lastTaker` is undefined, in which case those cards are not assigned to a player's captured pile.

When implementing or reviewing a rule change, locate the current code and tests first. State whether a discrepancy is observed behavior or a suspected bug. Add tests for the requested behavior and boundary cases, but do not fix unrelated discrepancies without authorization.

## References

- Project rules and build notes: [`../../../README.md`](../../../README.md)
