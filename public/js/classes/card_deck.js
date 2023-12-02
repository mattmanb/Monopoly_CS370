const comChestDeck = [
    "Advance to Go (Collect $200)",
    "Bursar error in your favor—Collect $200",
    "Parking fee—Pay $50",
    "Win a raffle you get $50",
    "Get Out of CC Free",
    "Eat at CC–Go directly to CC–Do not pass Go–Do not collect $200",
    "SC Movie Night—Collect $50 from every player for opening night seats",
    "Work retail over break—Receive $100",
    "Student Loans Refund–Collect $20",
    "It is your birthday—Collect $10",
    "Mysterious Venmo mistake–Collect $100",
    "Party gets too crazy, pay damage fees of $100",
    "Pay school fees of $150",
    "Receive $25 for tutoring",
    "You are assessed for street repairs–$40 per classroom–$115 per lecture hall",
    "Vending machine mishap–Collect $10",
    "Sidewalk surprise! You found $100"
];

const chanceDeck = [
    "Advance to Go (Collect $200)",
    "Get some tutoring at the learning center—If you pass Go, collect $200",
    "Advance to Poly Pizza– If you pass Go, collect $200",
    "Advance token to nearest Bridge. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
    "Advance token to the nearest Dormitory and pay owner twice the rental to which he/she is otherwise entitled. If Dorm is unowned, you may buy it from the Bank.",
    "Bursar pays you $50",
    "Get Out of CC Free",
    "Go Back 3 Spaces",
    "Eat at CC–Go directly to CC–Do not pass Go, do not collect $200",  //square 40 & player.injail = true; turns in jail = 3
    "Make general repairs on all your property–For each classroom pay $25–For each lecture hall $100",
    "Grab a meal off campus, lose $15",
    "Take a trip to Oriskany–If you pass Go, collect $200",
    "Admire the statue–Advance token to Wildcat Statue",    //square 39
    "You have been elected Class President–Pay each player $50",
    "Get a paid internship—Collect $150",
    "Ace your midterms for a reward—Collect $100",
    "You started a side hustle and your fellow students love it. Each player pays you $50"
];

const card = require("./card.js");

class card_deck {
    constructor(name, board) {
        this.name = name;
        this.deck = [];
        this.board = board;
    }
    initDeck() {
        // if(this.event === "teleport") {
        //     this.teleport(player, position);
        // } else if(this.event === "money") {
        //     this.money(player, price);
        // } else if(this.event === "jail") {
        //     player.goToJail();
        // } else if(this.event === "payAll") {
        //     this.moneyEveryone(player, price);
        // } else if(this.event === "getOutOfCC") {
        //     this.outOfCC(player);
        // } else if(this.event === "repair") {
        //     this.repair(player, isStreet);
        // }
        if(this.name === "chance") {
            this.deck.push(
                new card({
                    description: chanceDeck[0],
                    event: "teleport",
                    position: 0,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[1],
                    event: "teleport",
                    position: 11,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[2],
                    event: "teleport",
                    position: 21,
                    board:this.board
                }),
                new card({
                    description: chanceDeck[3],
                    event: "teleport",
                    position: -1,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[4],
                    event: "teleport",
                    position: -2,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[5],
                    event: "money",
                    amount: 50
                }),
                new card({
                    description: chanceDeck[6],
                    event: "getOutfOCC"
                }),
                new card({
                    description: chanceDeck[7],
                    event: "teleport",
                    position: -3,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[8],
                    event: "jail"
                }),
                new card({
                    description: chanceDeck[9],
                    description: "repair",
                    isStreet: 0     
                }),
                new card({
                    description: chanceDeck[10],
                    event: "money",
                    amount: -15
                }),
                new card({
                    description: chanceDeck[11],
                    event: "teleport",
                    position: 5,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[12],
                    event: "teleport",
                    position: 39,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[13],
                    event: "payAll",
                    amount: -50,
                    board: this.board
                }),
                new card({
                    description: chanceDeck[14],
                    event: "money",
                    amount: 150
                }),
                new card({
                    description: chanceDeck[15],
                    event: "money",
                    amount: 100
                }),
                new card({
                    description: chanceDeck[16],
                    event: "payAll",
                    amount: 50,
                    board: this.board
                })
                
            );
            this.shuffleDeck();             
        } else if(this.name === "community") {
            this.deck.push(
                new card({
                    description: comChestDeck[0],
                    event: "teleport",
                    position: 0,
                    board: this.board
                }),
                new card({
                    description: comChestDeck[1],
                    event: "money",
                    amount: 200
                }),
                new card({
                    description: comChestDeck[2],
                    event: "money",
                    amount: -150
                }),
                new card({
                    description: comChestDeck[3],
                    event: "money",
                    amount: 50
                }),
                new card({
                    description: comChestDeck[4],
                    event: "getOutOfCC"
                }),
                new card({
                    description: comChestDeck[5],
                    event: "jail"
                }),
                new card({
                    description: comChestDeck[6],
                    event: "payAll",
                    amount: 50,
                    board: this.board
                }),
                new card({
                    description: comChestDeck[7],
                    event: "money",
                    amount: 100
                }),
                new card({
                    description: comChestDeck[8],
                    event: "money",
                    amount: 20
                }),
                new card({
                    description: comChestDeck[9],
                    event: "money",
                    amount: 10
                }),
                new card({
                    description: comChestDeck[10],
                    event: "money",
                    amount: 100
                }),
                new card({
                    description: comChestDeck[11],
                    event: "money",
                    amount: -100
                }),
                new card({
                    description: comChestDeck[12],
                    event: "money",
                    amount: -150
                }),
                new card({
                    description: comChestDeck[13],
                    event: "money",
                    amount: 25
                }),
                new card({
                    description: comChestDeck[14],
                    event: "repair",
                    isStreet: 1
                }),
                new card({
                    description: comChestDeck[15],
                    event: "money",
                    amount: 10
                }),
                new card({
                    description: comChestDeck[16],
                    event: "money",
                    amount: 100
                })
            );
            this.shuffleDeck();
        }
    }
    shuffleDeck() {
        //Fisher-Yates shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    pullCard(player) {
        //if no more cards to pop, reset deck
        if(this.deck.length === 0) {
            this.initDeck();
        }
        const card = this.deck.pop();
        card.performAction(player);
        return;
    }
}

module.exports = card_deck;