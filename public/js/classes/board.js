const Property = require('./property.js');
const Chance_Card = require('./chance_card.js');
const Community_Chest_Card = require('./community_chest_card.js');
const Railroad = require('./railroad.js');
const Utility = require('./utility.js');
const Jail = require('./jail.js')

class board {
    constructor(player) {
        this.player = player;
        this.spaces = []
        this.spaces[0] = new Chance_Card(true, this.player, 200);
        this.spaces[1] = new Property({
            name:"Commuter Student Lounge", 
            price:60, color:"#8B4513",
            rent:[2, 10, 30, 90, 160, 250], 
            houseCost:50,
            mortgage:30 });
        this.spaces[2] = new Community_Chest_Card(); //Community Chest Card constructor should handle this
        this.spaces[3] = new Property({
            name:"Glowing Staircase", 
            price:60,
            rent:[4, 20, 60, 180, 320, 450], 
            houseCost:50,
            mortgage:30 });
        this.spaces[4] = new Chance_Card(true, this.player, Math.max(Math.round(player.getMoney()) * -.2, -200)); //sends the value in that makes the player pay less (-200 or -20% of players money)
        /*
        Explanation: Instead of having a creating a whole class or function for the student loans spot, 
        lets just make it a method in Chance_Card that lets the user choose 10% or $200 (probably should
        just auto calculate which value is lower then take that much away.)
        class Chance_Card {
            constructor(student_loans = false) { 
                this.student_loads = student_loans
            }
        }
        
        */
        this.spaces[5] = new Railroad({
            name:"Oriskany",
            price:200,
            mortgage:100 });
        this.spaces[6] = new Property({
            name:"Gannet Art Gallery", 
            price:100, 
            rent:[6, 30, 90, 270, 400, 550], 
            houseCost:50,
            mortgage:50 });
        this.spaces[7] = new Chance_Card();
        this.spaces[8] = new Property({
            name:"Wildcat Den", 
            price:100, 
            rent:[6, 30, 90, 270, 400, 550], 
            houseCost:50,
            mortgage:50 });
        this.spaces[9] = new Property({
            name:"Kunsella Computer Lab", 
            price:120, 
            rent:[8, 40, 100, 300, 450, 600], 
            houseCost:50,
            mortgage:60 });
        this.spaces[10] = "Just Passing Through";
        this.spaces[11] = new Property({
            name:"Learning Center", 
            price:140, 
            rent:[10, 50, 150, 450, 625, 750], 
            houseCost:100,
            mortgage:70 });
        this.spaces[12] = new Utility({
            name:"Main Bridge",
            price:150,
            mortgage:75 });
        this.spaces[13] = new Property({
            name:"Mario Cafe", 
            price:140, 
            rent:[10, 50, 150, 450, 625, 750], 
            houseCost:100,
            mortgage:70 });
        this.spaces[14] = new Property({
            name:"IT Desk", 
            price:160, 
            rent:[12, 60, 180, 500, 700, 900], 
            houseCost:100,
            mortgage:80 });
        this.spaces[15] = new Railroad({
            name:"Hilltop",
            price:200,
            mortgage:100 });
        this.spaces[16] = new Property({
            name:"400 Acre Cafe", 
            price:180, 
            rent:[14, 70, 200, 550, 750, 950], 
            houseCost:100,
            mortgage:90 });
        this.spaces[17] = new Community_Chest_Card();
        this.spaces[18] = new Property({
            name:"Wildcat Grill", 
            price:180, 
            rent:[14, 70, 200, 550, 750, 950], 
            houseCost:100,
            mortgage:90 });
        this.spaces[19] = new Property({
            name:"Viva El Taco", 
            price:200, 
            rent:[16, 80, 220, 600, 800, 1000], 
            houseCost:100,
            mortgage:100 });
        this.spaces[20] = "Hanging out at SC";
        this.spaces[21] = new Property({
            name:"Poly Pizza", 
            price:220, 
            rent:[18, 90, 250, 700, 875, 1050], 
            houseCost:150,
            mortgage:110 });
        this.spaces[22] = new Chance_Card();
        this.spaces[23] = new Property({
            name:"Mail Room", 
            price:220, 
            rent:[18, 90, 250, 700, 875, 1050], 
            houseCost:150,
            mortgage:110 });
        this.spaces[24] = new Property({
            name:"Wellness Center", 
            price:240, 
            rent:[20, 100, 300, 750, 925, 1100], 
            houseCost:100,
            mortgage:120 });
        this.spaces[25] = new Railroad({
            name:"ADK",
            price:200,
            mortgage:100 });
        this.spaces[26] = new Property({
            name:"Field House", 
            price:260, 
            rent:[22, 110, 330, 800, 975, 1150], 
            houseCost:150,
            mortgage:130 });
        this.spaces[27] = new Property({
            name:"Cross Country Trails", 
            price: 260, 
            rent:[22, 110, 330, 800, 975, 1150], 
            houseCost:150,
            mortgage:130 });
        this.spaces[28] = new Utility({
            name:"ADK Bridge",
            price:150,
            mortgage:75 });
        this.spaces[29] = new Property({
            name:"Old Soccer Fields", 
            price:280, 
            rent:[24, 120, 360, 850, 1025, 1200], 
            houseCost:150,
            mortgage:140 });
        this.spaces[30] = new Jail(); //send the player immediately to jail. This same object will be created when a player picks up a chance/comchest card that sends them to jail.
        this.spaces[31] = new Property({
            name:"Kunsella Hall", 
            price:300, 
            rent:[26, 130, 390, 900, 1100, 1275], 
            houseCost:200,
            mortgage:150 });
        this.spaces[32] = new Property({
            name:"Donovan Hall", 
            price:300, 
            rent:[26, 130, 390, 900, 1100, 1275], 
            houseCost:200,
            mortgage:150 });
        this.spaces[33] = new Community_Chest_Card();
        this.spaces[34] = new Property({
            name:"Cayan Library", 
            price:320, 
            rent:[28, 150, 450, 1000, 1200, 1400], 
            houseCost:200,
            mortgage:160 });
        this.spaces[35] = new Railroad({
            name:"Mohawk",
            price:200,
            mortgage:100 });
        this.spaces[36] = new Chance_Card();
        this.spaces[37] = new Property({
            name:"Alumni Pavilion", 
            price:350, 
            rent:[35, 175, 500, 1100, 1300, 1500], 
            houseCost:200,
            mortgage:175 });
        this.spaces[38] = new Chance_Card(true, this.player, -75);
        this.spaces[39] = new Property({
            name:"Wildcat Statue", 
            price:400, 
            rent:[50, 200, 600, 1400, 1700, 2000], 
            houseCost:200,
            mortgage:200 });
        this.spaces[40] = "In jail";
    }
    landOn(space_number) {
        let space = this.spaces[space_number];
        if(space instanceof Property) {
            if(space.isOwned()) { //if the property is owned, make the player who landed here pay rent
                space.payRent(this.player);
            } else { //otherwise, see if the player wants to buy it (if not, start an auction)
                space.queryPurchase(this.player); //see if the player wants to buy the property
                if(!space.isOwned()) {
                    space.startAuction();
                }
            }
            
        }
        else if(space instanceof Chance_Card) {
            space.pullChanceCard(this.player); //implement pullChanceCard method for chancecard (Maybe do a chance deck class to instantiate the deck and shuffle)
        }
        else if(space instanceof Community_Chest_Card) {
            space.pullCommunityChestCard(this.player); //implement pullCommunityChestCard method for com chest (Maybe do a community chest deck class to instantiate the deck and shuffle)
        }
        else if(space instanceof Railroad) {
            if(space.isOwned()) { //If the railroad is owned, make the play who landed here pay
                space.payRent(this.player);
            } else {//Otherwise, see if the player wants to buy the railroad
                space.queryPurchase(this.player);
                if(!space.isOwned()) { //if the railroad isn't purchased, start an auction for it
                    space.startAuction();
                }
            }
        }
        else if(space instanceof Utility) {
            if(space.isOwned()) {
                space.payRent(this.player);
            } else {
                space.queryPurchase(this.player);
                if(!space.isOwned()) {
                    space.startAuction();
                }
            }
        }
        else if(space instanceof Jail) {
            space.sendToJail(this.player); //send this player to jail
        }
    }
}