// chance card class
class chance_card {

    //This function gives the player a card from the chance deck
    giveChanceCard(player, chanceGameDeck) {
        //The parameters have default values; aka parameters pass in on spaces 4 and 38
        constructor(special_condition = false, player = null, price = null) {
            this.special_condition = special_condition;
            this.player = player;
            this.price = price;
            if(this.special_condition) {
                executeSpecialCondition(this.player, this.price)
            }
        }
        executeSpecialCondition(player, price) {
            player.addMoney(price); //add or subtract based on the price
            return;
        }
        const chanceDeck = [
            "Advance to Go (Collect $200)",
            "Get some tutoring at the learning center—If you pass Go, collect $200",
            "Advance to Poly Pizza– If you pass Go, collect $200",
            "Advance token to nearest Bridge. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
            "Advance token to the nearest Dormitory and pay owner twice the rental to which he/she {he} is otherwise entitled. If Dorm is unowned, you may buy it from the Bank.",
            "Bursar pays you $50",
            "Get Out of CC Free",
            "Go Back 3 Spaces",
            "Eat at CC–Go directly to CC–Do not pass Go, do not collect $200",
            "Make general repairs on all your property–For each classroom pay $25–For each lecture hall $100",
            "Grab a meal off campus, lose $15",
            "Take a trip to Oriskany–If you pass Go, collect $200",
            "Admire the statue–Advance token to Wildcat Statue",
            "You have been elected Class President–Pay each player $50",
            "Get a paid internship—Collect $150",
            "Ace your midterms for a reward—Collect $100",
            "You started a side hustle and your fellow students love it. Each player pays you $50"
        ];

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

