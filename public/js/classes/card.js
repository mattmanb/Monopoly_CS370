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
            //if bridge unowned, create opportunity to buy utility
            //if bridge is owned, pay ten times amount rolled on dice
            num1 = rollDice();
            num2 = rollDice();
            tot = addDice(num1, num2) * 10;
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
            //if dorm unowned, create buy opportunity
            // if dorm owned, pay twice amount
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
    
    outOfCC(player) {
        //add to inventory
        player.outOfJailCards++;
    }
    
    repair(player, isStreet) {
        if(isStreet) {
            tot = (player.housesOwned * 45) + (player.hotelsOwned * 115);
        }
        else{
            tot = (player.housesOwned * 25) + (player.hotelsOwned * 100);
        }
        player.money += tot;
    }
    
    moneyEveryone(player, x) {
        for(const id in backEndPlayers) {
            //if this player isn't the player that drew the card
            if(player != thatPlayer) {

            }
            //give or take 50
            thatPLayer.money -= 50;
            
            //get or lose
            player.money + x;
        }
        
    }

    getCardInfo() {
        return this.text;
    }
}