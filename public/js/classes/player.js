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
        //method to handle bankrupcy (removes the player from the game!)
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
            console.log("Passed GO! Collect $200.");
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
        //this msg gets returned to the server with information that needs to be emitted as a game event
        let msg = "";
        // Roll 2 dice
        const dice1 = this.rollDice()
        const dice2 = this.rollDice()

        const rolledDoubles = (dice1 === dice2)

        // Check if dice were doubles and handle if the user was in jail when they rolled
        if (rolledDoubles) {
            // Check if player is in jail, and remove them since they rolled doubles
            if(this.inJail) {
                msg += "Rolled doubles, exiting jail.\n";
                this.exitJail();
                //failsafe to make sure they don't get stuck in jail
                numDoubles = 0;
            }
            console.log("Rolled doubles, adding one to", numDoubles);
            // If yes, increment numDoubles
            // Check if numDoubles >= 3
            // if yes, player goes to jail and doesn't move
            numDoubles += 1
            if (numDoubles >= 3) {
                console.log("Rolled doubles 3 times, going to jail.");
                this.goToJail()
                numDoubles = 0;
                return [rolledDoubles, numDoubles, dice1+dice2, this.currentPosition, msg];
            }
        }
        // Handle if the player is in jail
        if(this.inJail) {
            this.turnsInJail -= 1;
            // Check if player has a get out of jail free card
            if(this.outOfJailCards > 0) {
                // If yes, use it and move player
                this.outOfJailCards -= 1;
                this.exitJail();
                console.log("Used get out of jail free card");
                msg += "Used get out of jail free card.\n";
                return [rolledDoubles, numDoubles, dice1+dice2, this.currentPosition, msg];
            }
            // Check if the player has served their time
            else if(this.turnsInJail === 0) {
                // If yes, pay $50 and move player
                this.money -= 50;
                this.exitJail();
                console.log("Paid $50 to get out of jail");
                msg += "Paid $50 to get out of jail.\n";
                return [rolledDoubles, numDoubles, dice1+dice2, this.currentPosition, msg];
            } else {
                // If no, increment turnsInJail
                console.log("Turns in jail:", this.turnsInJail);
                msg += `${this.name} is in jail for ${this.turnsInJail} more turn(s).\n`;
                return [rolledDoubles, numDoubles, dice1+dice2, this.currentPosition, msg];
            }
        } else {
            // Add dice rolls and move player that many spaces
            var diceTotal = dice1 + dice2
            console.log(`${this.name} rolled ${diceTotal}`);
            const passedGo = this.movePlayer(diceTotal);
            console.log(`Player position: ${this.currentPosition}`);

            // Land on that space and do appropriate action
            msg += board.landOn(this, this.currentPosition, diceTotal);

            if(passedGo) {
                msg += "\nPassed Go! Collect $200."
            }
        }

        return [rolledDoubles, numDoubles, diceTotal, this.currentPosition, msg] ;
    }
    goToJail() {
        this.inJail = true;
        this.turnsInJail = 3;
        this.currentPosition = 40;
    }
    exitJail() {
        this.inJail = false;
        this.turnsInJail = 0;
        this.currentPosition = 10;
    }
}

module.exports = player;