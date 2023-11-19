import { player } from './classes/player.js';

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
export class community_chest {
    constructor() {
        this.cards.push(
            new card(comChestDeck[0], () => teleport(player, 0)),
            new card(comChestDeck[1], () => money(player, 200)),
            new card(comChestDeck[2]),
            new card(comChestDeck[3]),
            new card(comChestDeck[4]),
            new card(comChestDeck[5]),
            new card(comChestDeck[6]),
            new card(comChestDeck[7]),
            new card(comChestDeck[8]),
            new card(comChestDeck[9]),
            new card(comChestDeck[10]),
            new card(comChestDeck[11]),
            new card(comChestDeck[12]),
            new card(comChestDeck[13]),
            new card(comChestDeck[14]),
            new card(comChestDeck[15]),
            new card(comChestDeck[16])
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