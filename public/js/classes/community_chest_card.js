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
export class community_chest_card {
    constructor() {
        this.cards.push(
            new card(comChestDeck[0], () => advanceGo(player)),
            new card(comChestDeck[1], () => advanceLC(player))
        );


    }

    //This function gives the player a card from the community chest deck
    giveCommunityChestCard(player, communityChestGameDeck) {
        
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

}
