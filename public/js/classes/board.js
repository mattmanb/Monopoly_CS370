const Property = require('./property.js');
const Chance_Card = require('./chance_card.js');
const Community_Chest_Card = require('./community_chest_card.js');
const Railroad = require('./railroad.js');
const Utility = require('./utility.js');
const Jail = require('./jail.js')

class board {
    constructor() {
        this.spaces = []
        this.spaces[0] = "GO";
        this.spaces[1] = new Property({
            name:"Mediterranean Avenue", 
            price:60, color:"#8B4513",
            rent:[2, 10, 30, 90, 160, 250], 
            houseCost:50,
            mortgage:30 });
        this.spaces[3] = new Property({
            name:"Baltic Avenue", 
            price:60,
            rent:[4, 20, 60, 180, 320, 450], 
            houseCost:50,
            mortgage:30 });
        this.spaces[5] = new railroad({
            name:"Reading Railroad",
            price:200,
            mortgage:100 });
        this.spaces[6] = new Property({
            name:"Oriental Avenue", 
            price:100, 
            rent:[6, 30, 90, 270, 400, 550], 
            houseCost:50,
            mortgage:50 });
        this.spaces[8] = new Property({
            name:"Vermont Avenue", 
            price:100, 
            rent:[6, 30, 90, 270, 400, 550], 
            houseCost:50,
            mortgage:50 });
        this.spaces[9] = new Property({
            name:"Connecticut Avenue", 
            price:120, 
            rent:[8, 40, 100, 300, 450, 600], 
            houseCost:50,
            mortgage:60 });
        this.spaces[11] = new Property({
            name:"St. Charles Place", 
            price:140, 
            rent:[10, 50, 150, 450, 625, 750], 
            houseCost:100,
            mortgage:70 });
        this.spaces[12] = new utility({
            name:"Electric Company",
            price:150,
            mortgage:75 });
        this.spaces[13] = new Property({
            name:"States Avenue", 
            price:140, 
            rent:[10, 50, 150, 450, 625, 750], 
            houseCost:100,
            mortgage:70 });
        this.spaces[14] = new Property({
            name:"Virginia Avenue", 
            price:160, 
            rent:[12, 60, 180, 500, 700, 900], 
            houseCost:100,
            mortgage:80 });
        this.spaces[15] = new railroad({
            name:"Pennsylvania Railroad",
            price:200,
            mortgage:100 });
        this.spaces[16] = new Property({
            name:"St. James Place", 
            price:180, 
            rent:[14, 70, 200, 550, 750, 950], 
            houseCost:100,
            mortgage:90 });
        this.spaces[18] = new Property({
            name:"Tennessee Avenue", 
            price:180, 
            rent:[14, 70, 200, 550, 750, 950], 
            houseCost:100,
            mortgage:90 });
        this.spaces[19] = new Property({
            name:"New York Avenue", 
            price:200, 
            rent:[16, 80, 220, 600, 800, 1000], 
            houseCost:100,
            mortgage:100 });
        this.spaces[21] = new Property({
            name:"Kentucky Avenue", 
            price:220, 
            rent:[18, 90, 250, 700, 875, 1050], 
            houseCost:150,
            mortgage:110 });
        this.spaces[23] = new Property({
            name:"Indiana Avenue", 
            price:220, 
            rent:[18, 90, 250, 700, 875, 1050], 
            houseCost:150,
            mortgage:110 });
        this.spaces[24] = new Property({
            name:"Illinois Avenue", 
            price:240, 
            rent:[20, 100, 300, 750, 925, 1100], 
            houseCost:100,
            mortgage:120 });
        this.spaces[25] = new railroad({
            name:"B. & O. Railroad",
            price:200,
            mortgage:100 });
        this.spaces[26] = new Property({
            name:"Atlantic Avenue", 
            price:260, 
            rent:[22, 110, 330, 800, 975, 1150], 
            houseCost:150,
            mortgage:130 });
        this.spaces[27] = new Property({
            name:"Ventnor Avenue", 
            price: 260, 
            rent:[22, 110, 330, 800, 975, 1150], 
            houseCost:150,
            mortgage:130 });
        this.spaces[28] = new utility({
            name:"Water Works",
            price:150,
            mortgage:75 });
        this.spaces[29] = new Property({
            name:"Marvin Gardens", 
            price:280, 
            rent:[24, 120, 360, 850, 1025, 1200], 
            houseCost:150,
            mortgage:140 });
        this.spaces[31] = new Property({
            name:"Pacific Avenue", 
            price:300, 
            rent:[26, 130, 390, 900, 1100, 1275], 
            houseCost:200,
            mortgage:150 });
        this.spaces[32] = new Property({
            name:"North Carolina Avenue", 
            price:300, 
            rent:[26, 130, 390, 900, 1100, 1275], 
            houseCost:200,
            mortgage:150 });
        this.spaces[34] = new Property({
            name:"Pennsylvania Avenue", 
            price:320, 
            rent:[28, 150, 450, 1000, 1200, 1400], 
            houseCost:200,
            mortgage:160 });
        this.spaces[35] = new railroad({
            name:"Short Line",
            price:200,
            mortgage:100 });
        this.spaces[37] = new Property({
            name:"Park Place", 
            price:350, 
            rent:[35, 175, 500, 1100, 1300, 1500], 
            houseCost:200,
            mortgage:175 });
        this.spaces[39] = new Property({
            name:"Boardwalk", 
            price:400, 
            rent:[50, 200, 600, 1400, 1700, 2000], 
            houseCost:200,
            mortgage:200 });
    }
}