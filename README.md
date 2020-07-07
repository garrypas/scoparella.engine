# Scoparella

## Introduction to scopa

This is a full working open-source engine for the classic Italian card game Scopa, written in Typescript.

### Rules

This is not comprehensive, but gives a basic outline of the rules of Scopa as implemented. More information can be found online, but bear in mind that rules may vary slightly.

Scopa is played with a traditional Italian deck of cards containing 40 cards, 10 of each suit (coins, cups, swords, clubs); it can also be played with a conventional 52 card deck by removing the 8, 9 and 10 and using the queen to replace the Knight (the "cavallo", or horse);

* The game supports 2, 3 or 4 players.
* 3 cards are dealt to each player and 4 are flopped on the table.
* Each player has a turn. They can take cards if they have a match (face value matches a card on the table, or - if not - there is a sum of face values equal to the card played); if the player is unable to take cards, they must place their card on the table. A player must play a card.
* Once all cards in hand are played another hand is dealt until all cards in the deck are dealt and played.
* The last player to take cards takes the cards remaining on the table.
  
### Scoring
* 1 point for the hand (or hand) with most cards; if all player have the same number of cards no point is awarded (tie).
* 1 point for the hand with the most coins; ties are decided as before.
* 1 point for the 7 of coins.
* 1 point for the hand with the highest "prime" (see below); ties are decided as before:
* 1 point for every "scopa" - a scopa is where a play clears the table. Lay the card that was played upright so that it can be counted at the end of the round.

The game is concluded when 1 or more players have 11 points or more and there is a single leader; if there is a tie (say both players have 11 points) then tie breaker rounds are played until a winner is determined.

#### The prime
Take the highest scoring card of each of the four suits and sum the prime. Each face is worth the following:
* Seven: 21 points
* Six: 18 points
* Ace: 16 points
* Five: 15 points
* Four: 14 points
* Three: 13 points
* Two: 12 points
* Royals: 10 points each

For example a hand where the highest primes are 21, 21, 18 and 18 points the total would be 71 points;

## Building

Install NPM dependencies (mostly dev dependencies for running tests and transpiling typescript)
```
npm i
```

```
npm run build
```

Verify the task has created a ./dist folder.

## Testing

After building, check that the tests run correctly:

Unit tests
```
npm t
```