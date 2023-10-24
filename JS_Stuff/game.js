/*
    Written by Brandon Carlough
*/

let playerCount = null; //find way to set this with a menu
let playerList = [];

//get player count
playerCount = 4;        //FIXME Just for tests, get input from user

//create player identity, color & name
for (i = 0; i < playerCount; i++) {
    let playerSetup = createPlayer();
    playerList.push(playerSetup);
}

//define decks
const communityChestDeck = [
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
    "Ace your midterms for a reward—Collect $100"
];

//Button triggers this
startGame();

/*
    The purpose of this function is to contain the full flow of the game.
    Control will be passed to other functions as players take turns and perform actions.
*/
function startGame() {
    //determine turn order
    let turnOrder = [];
    let dupRoll = false;
    do {
        for (i = 0; i < playerCount; i++) {
            let playerRoll = rollDice();
            turnOrder.push(playerRoll[0] + playerRoll[1]);
        }

        //if two players roll the same, redo everything
        let dupCheck = Array.from(new Set(turnOrder));
        if (turnOrder.length != dupCheck.length) {
            dupRoll = true;
            console.log(turnOrder);
            turnOrder = [];
        }
        else {
            dupRoll = false;
        }
    }
    while(dupRoll == true)

    console.log(turnOrder);
    

    //show turn order to users?


    //initialize decks
    let communityChestGameDeck = communityChestDeck;
    let chanceGameDeck = chanceDeck;

}

//The purpose of this function is to create a player
function createPlayer() {
    //get input about user color or token
    //get input about user name
    //return an array with all the information
}

/*
    The purpose of this function is to imitate the action of rolling two dice.
    The function returns an array containing two random numbers from 1 to 6,
    as well as a boolean goAgain value. This value allows for easy detection of double rolls
    but can be safely ignored for unrelated rolling activity such as determining turn order.
*/
function rollDice() {
    //Generate two random numbers from 1 to 6
    let firstDice = Math.floor(Math.random() * 6) + 1;
    let secondDice = Math.floor(Math.random() * 6) + 1;
    let goAgain = false;
    if(firstDice == secondDice) {
        let goAgain = true;
    }
    return [firstDice, secondDice, goAgain]
}

//This function gives the player a card from the community chest deck
function giveCommunityChestCard(communityChestGameDeck) {
    if(communityChestGameDeck.length <= 1) {
        communityChestGameDeck = communityChestDeck;
    }
    let randomIndex = Math.floor(Math.random() * communityChestGameDeck.length);
    let cardDelt = communityChestGameDeck[randomIndex];
    communityChestGameDeck.splice(randomIndex, 1);
    return cardDelt;
}

//This function gives the player a card from the chance deck
function giveChanceCard(chanceGameDeck) {
    if(chanceGameDeck.length <= 1) {
        chanceGameDeck = chanceDeck;
    }
    let randomIndex = Math.floor(Math.random() * chanceGameDeck.length);
    let cardDelt = chanceGameDeck[randomIndex];
    chanceGameDeck.splice(randomIndex);
    return cardDelt;
}