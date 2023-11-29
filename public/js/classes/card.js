import { player } from './classes/player.js';

export class Card {
    constructor(text, action) {
        this.text = text;
        this.action = action;
    }

    performAction(player) {
        if(typeof this.action === 'function') {
            this.action(player)
        }
        //console.log(`Get a paid internship—Collect $${money}`);
    }

    teleport(player, pos) {
        //Player must go to nearest bridge (utility)
        if(pos == -1) {
            if (player.currentPosition < 12 || player.currentPosition >= 28) {
                pos = 12;
            }
            else {
                pos = 28;
            }
            //if bridge unowned, creawte opportunity to buy utility

            //if bridge is owned, pay ten times amount rolled on dice
            num1 = rollDice();
            num2 = rollDice();
            tot = addDice(num1, num2);
        }

        //Player must go to nearest dorm (RR)
        else if ( pos == -2) {
            if (player.currentPosition < 5 || player.currentPosition >= 35) {
                pos = 5;
            }
            else if(player.currentPosition >= 5 && player.currentPosition < 15) {
                pos = 15;
            }
            else if(player.currentPosition >= 15 && player.currentPosition < 25) {
                pos = 25;
            }
            else {
                pos = 35;
            }
        }

        //player passes Go and not directly to jail
        if (pos < player.currentPosition && pos != 40) {
            player.money += 200;
        }
        //set player position
        player.currentPosition = pos;
        socket.emit('update-player', player) // emits new pos to the backend
    }

    money(player,x) {
        player.money += x;
    }
    
    advanceBridge(player) {
        //identify nearest ult
        //move player to nearest bridge (utility)
        //if pass Go collect 200
        //if unowned buy oppurtunity
        //else pay owner ten times amount on dice
    }
    
    advanceDorm(player) {
        //identify nearrest dorm
        //move player to nearest dorm
        //if pass Go collect 200
        //if unowned buy oppurtunity
        //else pay owner twice owned
    }
    
    bursarRaffle(player) {
        //get 50
    }
    
    outOfCC(player) {
        //add to inventory
        player.outOfJailCards++;
    }
    
    generalRepair(player) {
        //get classrooms
        //pay 25 each
        //get lecture halls
        //pay 100 each
    }
    
    classPresident(player) {
        //give each other player 50
    }

    movieNight(player) {
        //get 50 from each player
    }

    streetRepair(player) {
        //get classrooms
        //pay 45 each
        //get lecture halls
        //pay 115 each
    }

    getCardInfo() {
        return this.text;
    }
}