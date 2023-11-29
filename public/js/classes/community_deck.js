const card = require('./card.js');

const comChestDeck = [
    "Advance to Go (Collect $200)",
    "Bursar error in your favor—Collect $200",
    "Parking fee—Pay $50",
    "Win a raffle you get $50",
    "Get Out of CC Free",
    "Eat at CC–Go directly to CC–Do not pass Go–Do not collect $200",
    "SC Movie Night—Collect $50 from every player for opening night seats",
    "Work retail over break—Receive $100",
    "Student Loans Refund–Collect $20",
    "It is your birthday—Collect $10",
    "Mysterious Venmo mistake–Collect $100",
    "Party gets too crazy, pay damage fees of $100",
    "Pay school fees of $150",
    "Receive $25 for tutoring",
    "You are assessed for street repairs–$40 per classroom–$115 per lecture hall",
    "Vending machine mishap–Collect $10",
    "Sidewalk surprise! You found $100"
];


// community chest class
class community_deck {
    constructor() {
        this.cards = [];
        this.cards.push(
            new card(comChestDeck[0], () => teleport(player, 0)),
            new card(comChestDeck[1], () => money(player, 200)),
            new card(comChestDeck[2], () => money(player, -150)),
            new card(comChestDeck[3], () => money(player, 50)),
            new card(comChestDeck[4]),
            new card(comChestDeck[5], () => teleport(player, 40)),
            new card(comChestDeck[6]),
            new card(comChestDeck[7], () => money(player, 100)),
            new card(comChestDeck[8], () => money(player, 20)),
            new card(comChestDeck[9], () => money(player, 10)),
            new card(comChestDeck[10], () => money(player, 100)),
            new card(comChestDeck[11], () => money(player, -100)),
            new card(comChestDeck[12], () => money(player, -150)),
            new card(comChestDeck[13], () => money(player, 25)),
            new card(comChestDeck[14]),
            new card(comChestDeck[15], () => money(player, 10)),
            new card(comChestDeck[16], () => money(player, 100))
        );
    }

    shuffle() {

    }

    drawCard() {
        if(communityChestGameDeck.length <= 1) {
        communityChestGameDeck = communityChestDeck;
    }
    let randomIndex = Math.floor(Math.random() * communityChestGameDeck.length);
    let cardDelt = communityChestGameDeck[randomIndex];
    communityChestGameDeck.splice(randomIndex, 1);

    if(cardDelt == "Get Out of CC Free") 
        player.outOfJailCards++;
    return cardDelt;

    }

    resetDeck() {

    }



}

//This function gives the player a card from the community chest deck
function giveCommunityChestCard(player) {
    const drawnCard = community_chest.drawCard();
    console.log(`Drawn card: $(drawnCard.text)`);
    drawnCard.performAction(player);
}

module.exports = community_deck;