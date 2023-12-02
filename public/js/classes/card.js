class card {
    constructor({description, event, position = 0, amount = 0, board, isStreet = false}) {
        this.description = description;
        this.event = event; //just a string to determine what happens
        this.position = position;
        this.amount = amount;
        this.board = board;
        this.isStreet = isStreet;
    }

    performAction(player) {
        console.log(this.description);
        if(this.event === "teleport") {
            this.teleport(player);
        } else if(this.event === "money") {
            this.money(player);
        } else if(this.event === "jail") {
            player.goToJail();
        } else if(this.event === "payAll") {
            this.moneyEveryone(player);
        } else if(this.event === "getOutOfCC") {
            this.outOfCC(player);
        } else if(this.event === "repair") {
            this.repair(player);
        }
    }

    teleport(player) {
        //Player must go to nearest bridge (utility)
        if(this.position == -1) {
            if (player.currentPosition < 12 || player.currentPosition >= 28) {
                this.position = 12;
            }
            else {
                this.position = 28;
            }

            //if bridge is owned, pay ten times amount rolled on dice
            num1 = player.rollDice();
            num2 = player.rollDice();
            diceTotal = num1 + num2;
            player.teleport(this.position, this.board, diceTotal);
        }

        //Player must go to nearest dorm (RR)
        else if (this.position == -2) {
            if (player.currentPosition < 5 || player.currentPosition >= 35) {
                this.position = 5;
            }
            else if(player.currentPosition >= 5 && player.currentPosition < 15) {
                this.position = 15;
            }
            else if(player.currentPosition >= 15 && player.currentPosition < 25) {
                this.position = 25;
            }
            else {
                this.position = 35;
            }
            // player owes double the rent for this
            player.teleport(this.position, this.board, 0);
            player.teleport(this.position, this.board, 0);
        } else if(this.position === -3) {
            player.teleport(player.currentPosition - 3, this.board, -1);
        }
        else {
            //set player position
            player.teleport(this.position, this.board, 0);
        }
    }

    money(player) {
        player.addMoney(this.amount);
    }

    outOfCC(player) {
        //add to inventory
        player.outOfJailCards++;
    }
    
    repair(player) {
        if(this.isStreet) {
            tot = (player.housesOwned * 45) + (player.hotelsOwned * 115);
        }
        else{
            tot = (player.housesOwned * 25) + (player.hotelsOwned * 100);
        }
        player.addMoney(tot);
    }

    moneyEveryone(player) {
        allPlayers = this.board.players;
        for(const id in allPlayers) {
            if(allPlayers[id] !== player) {
                allPlayers[id].addMoney(-1*this.amount);
                player.addMoney(this.amount);
            }
        }
    }

    getCardInfo() {
        return this.text;
    }
}

module.exports = card;