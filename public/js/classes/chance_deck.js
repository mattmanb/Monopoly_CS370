const card = require('./card.js');

const chanceDeck = [
    "Advance to Go (Collect $200)",
    "Get some tutoring at the learning center—If you pass Go, collect $200",
    "Advance to Poly Pizza– If you pass Go, collect $200",
    "Advance token to nearest Bridge. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
    "Advance token to the nearest Dormitory and pay owner twice the rental to which he/she {he} is otherwise entitled. If Dorm is unowned, you may buy it from the Bank.",
    "Bursar pays you $50",
    "Get Out of CC Free",
    "Go Back 3 Spaces",
    "Eat at CC–Go directly to CC–Do not pass Go, do not collect $200",  //square 40 & player.injail = true; turns in jail = 3
    "Make general repairs on all your property–For each classroom pay $25–For each lecture hall $100",
    "Grab a meal off campus, lose $15",
    "Take a trip to Oriskany–If you pass Go, collect $200",
    "Admire the statue–Advance token to Wildcat Statue",    //square 39
    "You have been elected Class President–Pay each player $50",
    "Get a paid internship—Collect $150",
    "Ace your midterms for a reward—Collect $100",
    "You started a side hustle and your fellow students love it. Each player pays you $50"
];


// chance card class
class chance_deck {
    constructor() {
        this.cards = [];
        this.cards.push(
            new card(chanceDeck[0], () => teleport(player, 0)),
            new card(chanceDeck[1], () => teleport(player, 11)),
            new card(chanceDeck[2], () => teleport(player, 21)),
            new card(chanceDeck[3], () => teleport(player, -1)),
            new card(chanceDeck[4], () => teleport(player, -2)),
            new card(chanceDeck[5],),
            new card(chanceDeck[6],),
            new card(chanceDeck[7], () => teleport(player, player.currentPosition - 3)),
            new card(chanceDeck[8], () => teleport(player, 40)),
            new card(chanceDeck[9],),
            new card(chanceDeck[10], () => money(player, -15)),
            new card(chanceDeck[11], () => teleport(player, 5)),
            new card(chanceDeck[12], () => teleport(player, 39)),
            new card(chanceDeck[13],),
            new card(chanceDeck[14], () => money(player, 150)),
            new card(chanceDeck[15], () => money(player, 100)),
            new card(chanceDeck[16],)
        );
    }

    shuffle() {

    }

    drawCard() {
        if(chanceGameDeck.length <= 1) {
            chanceGameDeck = chanceDeck;
        }
        let randomIndex = Math.floor(Math.random() * chanceGameDeck.length);
        let cardDelt = chanceGameDeck[randomIndex];
        chanceGameDeck.splice(randomIndex);

        if(cardDelt == "Get Out of CC Free")
            player.outOfJailCards++;

        return cardDelt;

    }
}

//This function gives the player a card from the chance deck
function giveChanceCard(player) {
    const drawnCard = chance.drawCard();
    console.log(`Drawn card: $(drawnCard.text)`);
    drawnCard.performAction(player);
}

module.exports = chance_deck;