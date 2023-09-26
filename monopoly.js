
// Player class
class player {
    constructor(name, piece) {
        this.name = name
        this.piece = piece
        this.money = 1500
        this.currentPosition = 0
        this.inJail = false
    }
}

function Game() {
    
}

// Roll dice, return value from 1-6
function rollDice() {
    dice = Math.floor(Math.random() * 6) + 1
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
    player.currentPosition += numSpaces
    if (player.currentPosition >= 40)
        player.currentPosition -= 40
        player.money += 200
    return currentPosition
}

function rollAndMove(player) {

    numDoubles = 0

    // While loop ends if player ends up in jail during there turn
    // Can happen from 3 doubles, go to jail space, or chance card
    while (!player.inJail) {

        // Roll 2 dice
        dice1 = rollDice()
        dice2 = rollDice()

        // Check if dice were doubles
        rolledDoubles = isDouble(dice1,dice2)
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
        diceTotal = addDice(dice1, dice2)
        player.currentPosition = movePlayer(diceTotal, player.currentPosition)

        // Land on that space and do appropriate action
        landOnSpace(player.currentPosition)

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

function landOnSpace(player) {

    // Will employ some kind of switch function here to determine what to do
    // Property: check owner
        // If unowned, may buy or put to auction
        // If owned by other player, pay rent
        // If owned by self, do nothing
    // GO, Just Visiting, or Free Parking: Do nothing
    // Chance or Community Chest: draw card, perform appropriate action
    // Income or Luxury Tax: Pay appropriate amount

}

function takeTurn(player) {


}