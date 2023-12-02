const Property = require('./property.js');
const Chance_Deck = require('./chance_deck.js');
const Community_Deck = require('./community_deck.js');
const Railroad = require('./railroad.js');
const Utility = require('./utility.js');
const Avenue = require('./avenue.js')
const Special_Event = require('./special_event.js');
const Card = require('./card.js');
const Card_Deck = require('./card_deck.js');

class board {
    constructor(players) {
        //list of all the spaces (each space is an object)
        this.spaces = [];

        //list of all the avenues
        this.avenues = [];

        //dictionary of all the players
        this.players = players;

        //initialize community card deck
        this.community_deck = new Card_Deck("community", this);
        this.community_deck.initDeck();

        //initialize chance card deck
        this.chance_deck = new Card_Deck("chance", this);
        this.chance_deck.initDeck();

        this.spaces[0] = new Special_Event({name:"Go", amount:200});

        // Creating avenue objects so we can check for a monopoly easier
        this.avenues[0] = new Avenue({ name:"Cafeteria Corner", color:"dark-purple", spaces:[1, 3] });

        this.spaces[1] = new Property({
            name:"Commuter Student Lounge", 
            price:60, color:"#8B4513",
            rent:[2, 10, 30, 90, 160, 250], 
            houseCost:50,
            mortgage:30, 
            avenue: this.avenues[0], 
            io: this.io });
        this.avenues[0].addProperty(this.spaces[1]); // Add "Commuter Student Lounge" to "Cafeteria Corner"

        this.spaces[2] = this.community_deck; //Community Chest Card constructor should handle this

        this.spaces[3] = new Property({
            name:"Glowing Staircase", 
            price:60,
            rent:[4, 20, 60, 180, 320, 450], 
            houseCost:50,
            mortgage:30, 
            avenue: this.avenues[0], 
            io: this.io});
        this.avenues[0].addProperty(this.spaces[3]);

        this.spaces[4] = new Special_Event({name:"Student Loans Due", price:-200}); //Special Event constructor should handle this
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
            mortgage:100, 
            io: this.io });
        
        this.avenues[1] = new Avenue({ name:"Art Gallery Alley", color: "light-blue", spaces:[6, 8, 9] })
        this.spaces[6] = new Property({
            name:"Gannet Art Gallery", 
            price:100, 
            rent:[6, 30, 90, 270, 400, 550], 
            houseCost:50,
            mortgage:50, 
            avenue: this.avenues[1], 
            io: this.io });
        this.avenues[1].addProperty(this.spaces[6]);

        this.spaces[7] = this.chance_deck; //landOn method should handle this - just denoting this is a chance card space

        this.spaces[8] = new Property({
            name:"Wildcat Den", 
            price:100, 
            rent:[6, 30, 90, 270, 400, 550], 
            houseCost:50,
            mortgage:50, 
            avenue: this.avenues[1], 
            io: this.io });
        this.avenues[1].addProperty(this.spaces[8]);

        this.spaces[9] = new Property({
            name:"Kunsella Computer Lab", 
            price:120, 
            rent:[8, 40, 100, 300, 450, 600], 
            houseCost:50,
            mortgage:60, 
            avenue: this.avenues[1], 
            io: this.io });
        this.avenues[1].addProperty(this.spaces[9]);

        this.spaces[10] = "Just Passing Through";

        this.avenues[2] = new Avenue({ name:"Computer Lab Lane", color: "purple", spaces:[11, 13, 14] });

        this.spaces[11] = new Property({
            name:"Learning Center", 
            price:140, 
            rent:[10, 50, 150, 450, 625, 750], 
            houseCost:100,
            mortgage:70, 
            avenue: this.avenues[2], 
            io: this.io });
        this.avenues[2].addProperty(this.spaces[11]);

        this.spaces[12] = new Utility({
            name:"Main Bridge",
            price:150,
            mortgage:75, 
            io: this.io });

        this.spaces[13] = new Property({
            name:"Mario Cafe", 
            price:140, 
            rent:[10, 50, 150, 450, 625, 750], 
            houseCost:100,
            mortgage:70, 
            avenue: this.avenues[2] });
        this.avenues[2].addProperty(this.spaces[13]);

        this.spaces[14] = new Property({
            name:"IT Desk", 
            price:160, 
            rent:[12, 60, 180, 500, 700, 900], 
            houseCost:100,
            mortgage:80, 
            avenue: this.avenues[2], 
            io: this.io });
        this.avenues[2].addProperty(this.spaces[14]);

        this.spaces[15] = new Railroad({
            name:"Hilltop",
            price:200,
            mortgage:100, 
            io: this.io });

        this.avenues[3] = new Avenue({ name:"Quad Avenue", color: "blue", spaces: [16, 18, 19]})

        this.spaces[16] = new Property({
            name:"400 Acre Cafe", 
            price:180, 
            rent:[14, 70, 200, 550, 750, 950], 
            houseCost:100,
            mortgage:90, 
            avenue: this.avenues[3], 
            io: this.io });
        this.avenues[3].addProperty(this.spaces[16]);

        this.spaces[17] = this.community_deck;

        this.spaces[18] = new Property({
            name:"Wildcat Grill", 
            price:180, 
            rent:[14, 70, 200, 550, 750, 950], 
            houseCost:100,
            mortgage:90, 
            avenue: this.avenues[3], 
            io: this.io });
        this.avenues[3].addProperty(this.spaces[18]);

        this.spaces[19] = new Property({
            name:"Viva El Taco", 
            price:200, 
            rent:[16, 80, 220, 600, 800, 1000], 
            houseCost:100,
            mortgage:100, 
            avenue: this.avenues[3], 
            io: this.io });
        this.avenues[3].addProperty(this.spaces[19]);

        this.spaces[20] = "Hanging out at SC";

        this.avenues[4] = new Avenue({ name:"Rec Center Road", color:"red", spaces:[21, 23, 24] });

        this.spaces[21] = new Property({
            name:"Poly Pizza", 
            price:220, 
            rent:[18, 90, 250, 700, 875, 1050], 
            houseCost:150,
            mortgage:110, 
            avenue: this.avenues[4], 
            io: this.io });
        this.avenues[4].addProperty(this.spaces[21]);

        this.spaces[22] = this.chance_deck;

        this.spaces[23] = new Property({
            name:"Mail Room", 
            price:220, 
            rent:[18, 90, 250, 700, 875, 1050], 
            houseCost:150,
            mortgage:110, 
            avenue: this.avenues[4], 
            io: this.io });
        this.avenues[4].addProperty(this.spaces[23]);

        this.spaces[24] = new Property({
            name:"Wellness Center", 
            price:240, 
            rent:[20, 100, 300, 750, 925, 1100], 
            houseCost:100,
            mortgage:120, 
            avenue: this.avenues[4], 
            io: this.io });
        this.avenues[4].addProperty(this.spaces[24]);

        this.spaces[25] = new Railroad({
            name:"ADK",
            price:200,
            mortgage:100, 
            io: this.io });

        this.avenues[5] = new Avenue({name:"Athletics Avenue", color: "yellow", spaces:[26, 27, 29] });

        this.spaces[26] = new Property({
            name:"Field House", 
            price:260, 
            rent:[22, 110, 330, 800, 975, 1150], 
            houseCost:150,
            mortgage:130, 
            avenue: this.avenues[5], 
            io: this.io });
        this.avenues[5].addProperty(this.spaces[26]);

        this.spaces[27] = new Property({
            name:"Cross Country Trails", 
            price: 260, 
            rent:[22, 110, 330, 800, 975, 1150], 
            houseCost:150,
            mortgage:130, 
            avenue: this.avenues[5], 
            io: this.io });
        this.avenues[5].addProperty(this.spaces[27]);

        this.spaces[28] = new Utility({
            name:"ADK Bridge",
            price:150,
            mortgage:75, 
            io: this.io });

        this.spaces[29] = new Property({
            name:"Old Soccer Fields", 
            price:280, 
            rent:[24, 120, 360, 850, 1025, 1200], 
            houseCost:150,
            mortgage:140, 
            avenue: this.avenues[5], 
            io: this.io });
        this.avenues[5].addProperty(this.spaces[29]);

        this.spaces[30] = new Special_Event({name:"Go to Jail!", price: 0, position: 40}); //send the player immediately to jail when they land here

        this.avenues[6] = new Avenue({ name:"Library Lane", color:"green", spaces:[31, 32, 34] });

        this.spaces[31] = new Property({
            name:"Kunsella Hall", 
            price:300, 
            rent:[26, 130, 390, 900, 1100, 1275], 
            houseCost:200,
            mortgage:150, 
            avenue: this.avenues[6], 
            io: this.io });
        this.avenues[6].addProperty(this.spaces[31]);

        this.spaces[32] = new Property({
            name:"Donovan Hall", 
            price:300, 
            rent:[26, 130, 390, 900, 1100, 1275], 
            houseCost:200,
            mortgage:150, 
            avenue: this.avenues[6], 
            io: this.io });
        this.avenues[6].addProperty(this.spaces[32]);

        this.spaces[33] = this.chance_deck;

        this.spaces[34] = new Property({
            name:"Cayan Library", 
            price:320, 
            rent:[28, 150, 450, 1000, 1200, 1400], 
            houseCost:200,
            mortgage:160, 
            avenue: this.avenues[6], 
            io: this.io });
        this.avenues[6].addProperty(this.spaces[34]);

        this.spaces[35] = new Railroad({
            name:"Mohawk",
            price:200,
            mortgage:100, 
            io: this.io });
    
        this.spaces[36] = this.chance_deck;

        this.avenues[7] = new Avenue({ name:"Innovation Plaza", color:"dark-blue", spaces:[37, 39] });

        this.spaces[37] = new Property({
            name:"Alumni Pavilion", 
            price:350, 
            rent:[35, 175, 500, 1100, 1300, 1500], 
            houseCost:200,
            mortgage:175, 
            avenue: this.avenues[7], 
            io: this.io });
        this.avenues[7].addProperty(this.spaces[37]);

        this.spaces[38] = new Special_Event({name:"Restock Wildcat Dollars", price:-75});

        this.spaces[39] = new Property({
            name:"Wildcat Statue", 
            price:400, 
            rent:[50, 200, 600, 1400, 1700, 2000], 
            houseCost:200,
            mortgage:200, 
            avenue: this.avenues[7], 
            io: this.io });
        this.avenues[7].addProperty(this.spaces[39]);

        this.spaces[40] = "In jail";
    }
    landOn(player, space_number, diceTotal) {
        let space = this.spaces[space_number];
        if(space instanceof Property) {
            if(space.isOwned()) { //if the property is owned, make the player who landed here pay rent
                space.payRent(player);
            } else {
                console.log("Property is not owned");
            }
    
        }
        else if(space instanceof Special_Event) { //IMPLEMENT THIS
            return;
        }
        else if(space instanceof Card_Deck) { 
            space.pullCard(player)
            return;
        }
        else if(space instanceof Railroad) {
            if(space.isOwned()) { //If the railroad is owned, make the play who landed here pay
                space.payRent(player);
            } else {
                console.log("Railroad is not owned");
            }
        }
        else if(space instanceof Utility) {
            if(space.isOwned()) {
                space.payRent(player, diceTotal);
            } else {
                console.log("Utility is not owned");
            }
        }
        else {
            // the only other case is nothing happens, in which a message will be displayed... thats it
        }
    }
    isMonopoly(space_ind) {
        if(!(board[space_ind] instanceof Property)) {
            console.log("Checking for a non-property monopoly!");
            return;
        }
        let avenue; //this is the avenue we're going to check

        //Need to find what avenue we're checking
        const resultAvenue = this.avenues.find(avenue => avenue.spaces.includes(space_ind));

        //Check to see if the avenue is a monopoly by a player
        if(resultAvenue.isMonopoly()) {
            return true;
        } else {
            return false;
        }
    }
    //this function is for when the front end sends back information reguarding the purchse of a property
    getSpaceByName(spaceName) {
        return this.spaces.find(space => space.name === spaceName);
    }
}

module.exports = board;