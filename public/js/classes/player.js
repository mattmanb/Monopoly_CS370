// Player class
class player {
    constructor({ name = null, piece = null, money = 1500, position = 0, inJail = false, outOfJailCards = 0, turnsInJail = 0, playerNumber}) {
        this.name = name;
        this.piece = piece;
        this.money = money;
        this.currentPosition = position;
        this.inJail = inJail;
        this.outOfJailCards = outOfJailCards;
        this.turnsInJail = turnsInJail;
        this.playerNumber = playerNumber;
        this.railroadsOwned = 0;
        this.houses = 0;
        this.motels = 0;
    }

    addMoney(money) {
        this.money += money
        if(this.money <= 0) {
            bankrupt();
        }
        return;
    }
    checkMoney() {
        if(this.money <= 0) {
            bankrupt();
        }
        return;
    }
    bankrupt() {
        //method to handle bankrupcy
    }
    movePlayer(numSpaces) {
        let passedGo = false;
        this.currentPosition = this.currentPosition + numSpaces;
        if (this.currentPosition >= 40) {
            this.currentPosition = this.currentPosition - 40;
            this.money += 200;
            passedGo = true;
            console.log("Pass GO, collect 200!");
        }
        return passedGo;
    }
    // this is for card stuff
    teleport(pos, board, diceTotal) {
        this.currentPosition = pos;
        // if diceTotal is -1, the player is moving back 3 spaces (should not pass go)
        if (pos < this.currentPosition && diceTotal !== -1) {
            this.money += 200;
        }
        board.landOn(this, this.currentPosition, diceTotal);
    }
    setPosition(pos) {
        this.currentPosition = pos;
        return;
    }
    rollDice() {
        var dice = Math.floor(Math.random() * 6) + 1
        return dice
    }
    isDouble(dice1, dice2) {
        if (dice1 == dice2)
            return true
        else
            return false
    }
    rollAndMove(numDoubles = 0, board) { //set default numDoubles to 0 (if a number gets passed in the default gets overridden)
        // Roll 2 dice
        const dice1 = this.rollDice()
        const dice2 = this.rollDice()

        const rolledDoubles = this.isDouble(dice1, dice2)

        // Check if dice were doubles
        if (rolledDoubles) {

            // If yes, increment numDoubles
            // Check if numDoubles >= 3
            // if yes, player goes to jail and doesn't move
            numDoubles += 1
            if (numDoubles >= 3) {
                this.goToJail()
                return
            }
        }
        // Add dice rolls and move player that many spaces
        var diceTotal = dice1 + dice2
        console.log(`${this.name} rolled ${diceTotal}`);
        const passedGo = this.movePlayer(diceTotal);
        console.log(`Player position: ${this.currentPosition}`);

        // Land on that space and do appropriate action
        let msg = board.landOn(this, this.currentPosition, diceTotal);

        if(passedGo) {
            msg += "\nPassed Go! Collect $200."
        }

        return [rolledDoubles, numDoubles, diceTotal, this.currentPosition, msg] ;
    }
    goToJail() {
        this.inJail = true;
        this.turnsInJail = 3;
        this.currentPosition = 40;
    }
}

module.exports = player;