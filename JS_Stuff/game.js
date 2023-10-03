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
    "Bank error in your favor—Collect $200",
    "Doctor's fee—Pay $50",
    "From sale of stock you get $50",
    "Get Out of Jail Free",
    "Go to Jail–Go directly to jail–Do not pass Go–Do not collect $200",
    "Grand Opera Night—Collect $50 from every player for opening night seats",
    "Holiday Fund matures—Receive $100",
    "Income tax refund–Collect $20",
    "It is your birthday—Collect $10",
    "Life insurance matures–Collect $100",
    "Pay hospital fees of $100",
    "Pay school fees of $150",
    "Receive $25 consultancy fee",
    "You are assessed for street repairs–$40 per house–$115 per hotel",
    "You have won second prize in a beauty contest–Collect $10",
    "You inherit $100"
  ];

  const chanceDeck = [
    "Advance to Go (Collect $200)",
    "Advance to Illinois Ave—If you pass Go, collect $200",
    "Advance to St. Charles Place – If you pass Go, collect $200",
    "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
    "Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.",
    "Bank pays you dividend of $50",
    "Get Out of Jail Free",
    "Go Back 3 Spaces",
    "Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200",
    "Make general repairs on all your property–For each house pay $25–For each hotel $100",
    "Pay poor tax of $15",
    "Take a trip to Reading Railroad–If you pass Go, collect $200",
    "Take a walk on the Boardwalk–Advance token to Boardwalk",
    "You have been elected Chairman of the Board–Pay each player $50",
    "Your building and loan matures—Collect $150",
    "You have won a crossword competition—Collect $100"
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
    let randomIndex = Math.floor(Math.random() * communityChestGameDeck.length) + 1;
    let cardDelt = communityChestGameDeck[randomIndex];
    communityChestGameDeck.splice(randomIndex, 1);
    return cardDelt;
}

//This function gives the player a card from the chance deck
function giveChanceCard(chanceGameDeck) {
    if(chanceGameDeck.length <= 1) {
        chanceGameDeck = communityChestDeck;
    }
    let randomIndex = Math.floor(Math.random() * chanceGameDeck.length) + 1;
    let cardDelt = chanceGameDeck[randomIndex];
    chanceGameDeck.splice(randomIndex);
    return cardDelt;
}