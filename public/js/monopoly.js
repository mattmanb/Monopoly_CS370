
// Need to set as type module in HTML for this to work
import {
    player
} from './classes/player.js';
import {
    property
} from './classes/property.js'
import {
    chance_card
} from './classes/chance_card.js'
import {
    community_chest_card
} from './classes/community_chest_card.js'

// we'll need a shuffle community cards
// and a shuffle chance cards

/*
function Game() {
    
}
*/

// Roll dice, return value from 1-6
function rollDice() {
    var dice = Math.floor(Math.random() * 6) + 1
    return dice
}

// Add 2 dice together, return sum
function addDice(dice1, dice2) {
    return (dice1 + dice2)
}

// Return true if dice are doubles, false otherwise
function isDouble(dice1, dice2) {
    if (dice1 == dice2)
        return true
    else
        return false
}

// Moves player certain number of spaces
// returns number from 0-39, since board has 40 spaces
// if passing GO, player collects $200
function movePlayer(numSpaces, player) {
    player.setPosition(player.getPosition() + numSpaces)
    if (player.getPosition() >= 40) {
        player.setPosition(player.getPosition() - 40)
        player.addMoney(200)
        console.log("Pass GO, collect 200!")
    }
    return
}

function rollAndMove(player) {

    var numDoubles = 0

    // While loop ends if player ends up in jail during there turn
    // Can happen from 3 doubles, go to jail space, or chance card
    while (!player.inJail) {

        // Roll 2 dice
        var dice1 = rollDice()
        var dice2 = rollDice()

        // Check if dice were doubles
        var rolledDoubles = isDouble(dice1,dice2)
        if (rolledDoubles) {

            // If yes, increment numDoubles
            // Check if numDoubles >= 3
            // if yes, player goes to jail and doesn't move
            numDoubles += 1
            if (numDoubles >= 3) {
                goToJail(player)
                return
            }
        }
        // Add dice rolls and move player that many spaces
        var diceTotal = addDice(dice1, dice2)
        console.log(player.name + " rolled " + diceTotal.toString() + ". Doubles: " + rolledDoubles.toString())
        movePlayer(diceTotal, player)
        console.log("Player position: " + player1.getPosition().toString())

        // Land on that space and do appropriate action
        landOnSpace(player)

        // If dice are not doubles, exit function
        if (!rolledDoubles) {
            return
        }

    }
    // Exit function if player is in jail
    return
}

// Sets inJail to true
// Sets currentPosition to 40 (may change)
function goToJail(player) {
    player.inJail = true
    player.currentPosition = 40
}

// Attempt to leave jail
function attemptJailLeave(player) {
    dice1 = rollDice()
    dice2 = rollDice()
    rolledDoubles = isDouble(dice1, dice2)

    // If doubles are rolled, move player to Just Visiting and then move them by the number they rolled
    if (rolledDoubles) {
        diceTotal = addDice(dice1, dice2)
        player.setInJail(false)
        player.setTurnsInJail(0)
        player.setPosition(10)
        movePlayer(diceTotal, player)
    }
    else {
        // Count how many turns they've been in jail
        player.setTurnsInJail(player.getTurnsInJail() + 1)
    }
    return
}

function landOnSpace(player) {

    let space = player.getPosition()

    // Will employ some kind of switch function here to determine what to do
    // Property: check owner
        // If unowned, may buy or put to auction
        // If owned by other player, pay rent
        // If owned by self, do nothing
    // GO, Just Visiting, or Free Parking: Do nothing
    // Chance or Community Chest: draw card, perform appropriate action
    // Income or Luxury Tax: Pay appropriate amount

    if (board[space] instanceof property) {

        if (board[space].owner == null) {

            if (player.getMoney() >= board[space].price) {

                let choice = confirm("Would you like to buy " + board[space].name + " for " + board[space].price.toString() + "?")
                if (choice) {

                    board[space].owner = player
                    player.addMoney(-1 * board[space].price)
                    console.log(board[space].name + " is now owned by " + player.getName())
                    console.log(player.getName() + " now has " + player.getMoney().toString())
                }
                else {
                    console.log(player.getName() + " has chosen not to buy " + board[space].name)
                }
            }
            else {
                console.log(player.getName() + " doesn't have enough money.")
            }
        }
        else {
            console.log(player.getName() + " pays " + board[space].owner.getName() + " " + board[space].price.toString() + ".")
        }
    }


}

/*
function takeTurn(player) {

    turnOver = false
    while (turnOver == false) {
        
    }

}
*/

/* Still figuring out this part
window.onload = function() {
    game = new Game()
}
*/

//Init all properties, no railroads or utilities

// We will change names to Monopolytechnic later... :-)

let board = [] //For now, assuming the board is a list of property spaces where the index is the position

board[1] = new property({
    name:"Mediterranean Avenue", 
    price:60, color:"#8B4513",
    rent:[2, 10, 30, 90, 160, 250], 
    houseCost:50,
    mortgage:30 });
board[3] = new property({
    name:"Baltic Avenue", 
    price:60,
    rent:[4, 20, 60, 180, 320, 450], 
    houseCost:50,
    mortgage:30 });
board[6] = new property({
    name:"Oriental Avenue", 
    price:100, 
    rent:[6, 30, 90, 270, 400, 550], 
    houseCost:50,
    mortgage:50 });
board[8] = new property({
    name:"Vermont Avenue", 
    price:100, 
    rent:[6, 30, 90, 270, 400, 550], 
    houseCost:50,
    mortgage:50 });
board[9] = new property({
    name:"Connecticut Avenue", 
    price:120, 
    rent:[8, 40, 100, 300, 450, 600], 
    houseCost:50,
    mortgage:60 });
board[11] = new property({
    name:"St. Charles Place", 
    price:140, 
    rent:[10, 50, 150, 450, 625, 750], 
    houseCost:100,
    mortgage:70 });
board[13] = new property({
    name:"States Avenue", 
    price:140, 
    rent:[10, 50, 150, 450, 625, 750], 
    houseCost:100,
    mortgage:70 });
board[14] = new property({
    name:"Virginia Avenue", 
    price:160, 
    rent:[12, 60, 180, 500, 700, 900], 
    houseCost:100,
    mortgage:80 });
board[16] = new property({
    name:"St. James Place", 
    price:180, 
    rent:[14, 70, 200, 550, 750, 950], 
    houseCost:100,
    mortgage:90 });
board[18] = new property({
    name:"Tennessee Avenue", 
    price:180, 
    rent:[14, 70, 200, 550, 750, 950], 
    houseCost:100,
    mortgage:90 });
board[19] = new property({
    name:"New York Avenue", 
    price:200, 
    rent:[16, 80, 220, 600, 800, 1000], 
    houseCost:100,
    mortgage:100 });
board[21] = new property({
    name:"Kentucky Avenue", 
    price:220, 
    rent:[18, 90, 250, 700, 875, 1050], 
    houseCost:150,
    mortgage:110 });
board[23] = new property({
    name:"Indiana Avenue", 
    price:220, 
    rent:[18, 90, 250, 700, 875, 1050], 
    houseCost:150,
    mortgage:110 });
board[24] = new property({
    name:"Illinois Avenue", 
    price:240, 
    rent:[20, 100, 300, 750, 925, 1100], 
    houseCost:100,
    mortgage:120 });
board[26] = new property({
    name:"Atlantic Avenue", 
    price:260, 
    rent:[22, 110, 330, 800, 975, 1150], 
    houseCost:150,
    mortgage:130 });
board[27] = new property({
    name:"Ventnor Avenue", 
    price: 260, 
    rent:[22, 110, 330, 800, 975, 1150], 
    houseCost:150,
    mortgage:130 });
board[29] = new property({
    name:"Marvin Gardens", 
    price:280, 
    rent:[24, 120, 360, 850, 1025, 1200], 
    houseCost:150,
    mortgage:140 });
board[31] = new property({
    name:"Pacific Avenue", 
    price:300, 
    rent:[26, 130, 390, 900, 1100, 1275], 
    houseCost:200,
    mortgage:150 });
board[32] = new property({
    name:"North Carolina Avenue", 
    price:300, 
    rent:[26, 130, 390, 900, 1100, 1275], 
    houseCost:200,
    mortgage:150 });
board[34] = new property({
    name:"Pennsylvania Avenue", 
    price:320, 
    rent:[28, 150, 450, 1000, 1200, 1400], 
    houseCost:200,
    mortgage:160 });
board[37] = new property({
    name:"Park Place", 
    price:350, 
    rent:[35, 175, 500, 1100, 1300, 1500], 
    houseCost:200,
    mortgage:175 });
board[39] = new property({
    name:"Boardwalk", 
    price:400, 
    rent:[50, 200, 600, 1400, 1700, 2000], 
    houseCost:200,
    mortgage:200 });

// Test stuff
/*
x = rollDice()
y = rollDice()
console.log(x + ", " + y)
console.log("Sum: " + addDice(x, y))
console.log("Doubles: " + isDouble(x, y))

let player1 = new player("Javier", "car")
console.log(player1.getName() + " has " + player1.getMoney().toString())
var i
for (i = 0 ; i < 6 ; i++) {
    rollAndMove(player1)
    console.log(player1.getName() + " has " + player1.getMoney().toString())
}
*/