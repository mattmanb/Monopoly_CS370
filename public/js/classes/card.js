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
        console.log(`Get a paid internship—Collect $${money}`);

    }

    teleport(player, pos) {
        passedGo(player);
        player.setPosition(pos);
    }

    money(player,x) {
        player.addMoney(x);
    }

    advanceGo(player) {
        //move player icon to go
        player.setPosition(0);
    }
    
    advanceLC(player) {
        //move player icon to Learning center
        //if pass go get 200
    }
    
    advancePP(player) {
        //move player to poly pizza
        //if pass go get 200
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
    
    backThree(player) {
        //move player three spaces back
    }
    
    eatAtCC(player) {
        //go to cc jail
    }
    
    generalRepair(player) {
        //get classrooms
        //pay 25 each
        //get lecture halls
        //pay 100 each
    }
    
    mealOffCampus(player) {
        //pay 15
    }
    
    advanceOriskany(player) {
        //move player to Oriskany
        //if pass go collect 200
    
    }
    
    advanceStatue(player) {
        //move player to statue
    }
    
    classPresident(player) {
        //give each other player 50
    }
    paidInternship(player) {
        //collect 150
    }
    
    midtermsRetailVenmoSidewalk(player) {
        //collect 100
    }

    bursarError(player) {
        //collect 200
    }

    parkingFee(player) {
        //pay 50
    }

    movieNight(player) {
        //get 50 from each player
    }

    loansRefund(player) {
        //collect 20
    }

    birthdayVending(player) {
        //get 10
    }

    partyDamamge(player) {
        //pay 100
    }

    tutor(player) {
        //get 25
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