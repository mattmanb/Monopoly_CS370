//backend data
frontEndPlayers = {}
const socket = io(); // this player

// we'll need a shuffle community cards
// and a shuffle chance cards

/*
function Game() {
    
}
*/

function checkMonopoly(space) {
    isMonopoly = false
    switch(space) {
        case 1:
        case 3:
            if (board[1].owner == board[3].owner) {
                isMonopoly = true
            }
            break

        case 6:
        case 8:
        case 9:
            if (board[6].owner == board[8].owner && board[6].owner == board[9].owner) {
                isMonopoly = true
            }
            break

        case 11:
        case 13:
        case 14:
            if (board[11].owner == board[13].owner && board[11].owner == board[14].owner) {
                isMonopoly = true
            }
            break

        case 16:
        case 18:
        case 19:
            if (board[16].owner == board[18].owner && board[16].owner == board[19].owner) {
                isMonopoly = true
            }
            break

        case 21:
        case 23:
        case 24:
            if (board[21].owner == board[23].owner && board[21].owner == board[24].owner) {
                isMonopoly = true
            }
            break
        
        case 26:
        case 27:
        case 29:
            if (board[26].owner == board[27].owner && board[26].owner == board[29].owner) {
                isMonopoly = true
            }
            break

        case 31:
        case 32:
        case 34:
            if (board[31].owner == board[32].owner && board[31].owner == board[34].owner) {
                isMonopoly = true
            }
            break

        case 37:
        case 39:
            if (board[37].owner == board[39].owner) {
                isMonopoly = true
            }
            break
    }

    return isMonopoly
}

function railroadRent(owner) {
    numRailroads = 0
    for(i = 0 ; i < 4 ; i++) {
        if (board[5 + (i * 10)].owner === owner) {
            numRailroads += 1
        }
    }
    rent = (2 ** (numRailroads - 1)) * 25
    return rent
}

function utilityRent() {
    bothUtilities = false
    rent = addDice(rollDice(), rollDice())
    if (board[12].owner == board[28].owner) {
        rent = rent * 10
    }
    else {
        rent = rent * 4
    }
    return rent
}

/*
function takeTurn(player) {

    turnOver = false
    while (turnOver == false) {
        
    }

}
*/

/* Still figuring out this part
window.onload = function() {
    game = new Game()
}
*/

//Init all properties, no railroads or utilities

// We will change names to Monopolytechnic later... :-)

let board = [] //For now, assuming the board is a list of property spaces where the index is the position

board[1] = new property({
    name:"Mediterranean Avenue", 
    price:60, color:"#8B4513",
    rent:[2, 10, 30, 90, 160, 250], 
    houseCost:50,
    mortgage:30 });
board[3] = new property({
    name:"Baltic Avenue", 
    price:60,
    rent:[4, 20, 60, 180, 320, 450], 
    houseCost:50,
    mortgage:30 });
board[5] = new railroad({
    name:"Reading Railroad",
    price:200,
    mortgage:100 });
board[6] = new property({
    name:"Oriental Avenue", 
    price:100, 
    rent:[6, 30, 90, 270, 400, 550], 
    houseCost:50,
    mortgage:50 });
board[8] = new property({
    name:"Vermont Avenue", 
    price:100, 
    rent:[6, 30, 90, 270, 400, 550], 
    houseCost:50,
    mortgage:50 });
board[9] = new property({
    name:"Connecticut Avenue", 
    price:120, 
    rent:[8, 40, 100, 300, 450, 600], 
    houseCost:50,
    mortgage:60 });
board[11] = new property({
    name:"St. Charles Place", 
    price:140, 
    rent:[10, 50, 150, 450, 625, 750], 
    houseCost:100,
    mortgage:70 });
board[12] = new utility({
    name:"Electric Company",
    price:150,
    mortgage:75 });
board[13] = new property({
    name:"States Avenue", 
    price:140, 
    rent:[10, 50, 150, 450, 625, 750], 
    houseCost:100,
    mortgage:70 });
board[14] = new property({
    name:"Virginia Avenue", 
    price:160, 
    rent:[12, 60, 180, 500, 700, 900], 
    houseCost:100,
    mortgage:80 });
board[15] = new railroad({
    name:"Pennsylvania Railroad",
    price:200,
    mortgage:100 });
board[16] = new property({
    name:"St. James Place", 
    price:180, 
    rent:[14, 70, 200, 550, 750, 950], 
    houseCost:100,
    mortgage:90 });
board[18] = new property({
    name:"Tennessee Avenue", 
    price:180, 
    rent:[14, 70, 200, 550, 750, 950], 
    houseCost:100,
    mortgage:90 });
board[19] = new property({
    name:"New York Avenue", 
    price:200, 
    rent:[16, 80, 220, 600, 800, 1000], 
    houseCost:100,
    mortgage:100 });
board[21] = new property({
    name:"Kentucky Avenue", 
    price:220, 
    rent:[18, 90, 250, 700, 875, 1050], 
    houseCost:150,
    mortgage:110 });
board[23] = new property({
    name:"Indiana Avenue", 
    price:220, 
    rent:[18, 90, 250, 700, 875, 1050], 
    houseCost:150,
    mortgage:110 });
board[24] = new property({
    name:"Illinois Avenue", 
    price:240, 
    rent:[20, 100, 300, 750, 925, 1100], 
    houseCost:100,
    mortgage:120 });
board[25] = new railroad({
    name:"B. & O. Railroad",
    price:200,
    mortgage:100 });
board[26] = new property({
    name:"Atlantic Avenue", 
    price:260, 
    rent:[22, 110, 330, 800, 975, 1150], 
    houseCost:150,
    mortgage:130 });
board[27] = new property({
    name:"Ventnor Avenue", 
    price: 260, 
    rent:[22, 110, 330, 800, 975, 1150], 
    houseCost:150,
    mortgage:130 });
board[28] = new utility({
    name:"Water Works",
    price:150,
    mortgage:75 });
board[29] = new property({
    name:"Marvin Gardens", 
    price:280, 
    rent:[24, 120, 360, 850, 1025, 1200], 
    houseCost:150,
    mortgage:140 });
board[31] = new property({
    name:"Pacific Avenue", 
    price:300, 
    rent:[26, 130, 390, 900, 1100, 1275], 
    houseCost:200,
    mortgage:150 });
board[32] = new property({
    name:"North Carolina Avenue", 
    price:300, 
    rent:[26, 130, 390, 900, 1100, 1275], 
    houseCost:200,
    mortgage:150 });
board[34] = new property({
    name:"Pennsylvania Avenue", 
    price:320, 
    rent:[28, 150, 450, 1000, 1200, 1400], 
    houseCost:200,
    mortgage:160 });
board[35] = new railroad({
    name:"Short Line",
    price:200,
    mortgage:100 });
board[37] = new property({
    name:"Park Place", 
    price:350, 
    rent:[35, 175, 500, 1100, 1300, 1500], 
    houseCost:200,
    mortgage:175 });
board[39] = new property({
    name:"Boardwalk", 
    price:400, 
    rent:[50, 200, 600, 1400, 1700, 2000], 
    houseCost:200,
    mortgage:200 });

// Test stuff
/*
x = rollDice()
y = rollDice()
console.log(x + ", " + y)
console.log("Sum: " + addDice(x, y))
console.log("Doubles: " + isDouble(x, y))

let player1 = new player("Javier", "car")
console.log(player1.getName() + " has " + player1.getMoney().toString())
var i
for (i = 0 ; i < 6 ; i++) {
    rollAndMove(player1)
    console.log(player1.getName() + " has " + player1.getMoney().toString())
}
*/