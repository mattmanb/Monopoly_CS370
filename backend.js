//assume the backend is the most critical in terms of data (don't rely on
//front end post requests!)

//can't use import/export statements without making this a 'module'
//this syntax works instead
const Player = require('./public/js/classes/player.js');
const Property = require('./public/js/classes/property.js');
const Railroad = require('./public/js/classes/railroad.js');
const Utility = require('./public/js/classes/utility.js');
const Avenue = require('./public/js/classes/avenue.js')
const Board = require('./public/js/classes/board.js');
const Card = require('./public/js/classes/card.js');
const Card_Deck = require('./public/js/classes/card_deck.js');

const fs = require('fs');

/*   Server setup   */
//express server
const express = require('express');
const app = express(); //here is the express server

//http server
const http = require('http')
const server = http.createServer(app) //creates http server wrapped around express server

//Socket.io server
const { Server } = require('socket.io');
const { start } = require('repl');
const io = new Server(server, { 
    pingInterval:2000,
    pingTimeout:20000
}); //socket.io server wrapped around http server wrapped around express server (say that 10 times fast)
/*   End Server setup   */

const port = 3000; //changable later (80 is default port)

app.use(express.static('public')); //this makes the public directory accessible to the public (F12 on the page)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // NEED TO CHANGE THIS IF THE MAIN HTML PAGE ISNT 'index.html'
});

/* Start backend stuff */
const backEndPlayers = {} // dictionary of backend players with key=socket.id and value=player object

var backEndPieces = ["Thimble", "Shoe", "Top Hat", 
                     "Wheelbarrow", "Battleship", 
                     "Racecar", "Dog", "Iron"];

var availablePlayers = [1, 2, 3, 4, 5, 6, 7, 8];

var inLobby = true;

const messages = {"info": "#8dc6ff", "warning": "#FEBE10", "error": "red", "success": "#32de84", "surrender": "#955251"};

// Vars for checking who's turn it is
var turnOrder = [];
var numDoubles = 0;
var currentPlayerTurn = 0;
var diceRolled = false ;

io.on('connection', (socket) => {
    // ########################### Lobby Handling ########################### //
    console.log('a user connected');
    if(availablePlayers.length > 0 && inLobby) {
        //emit the pieces to the front end
        socket.emit('pieces-list', backEndPieces);
        //initialize a player's data
        backEndPlayers[socket.id] = new Player({playerNumber: Math.min(...availablePlayers)});
        //get an instance of the new player
        backEndPlayer = backEndPlayers[socket.id];

        //player number index update
        const pNindex = availablePlayers.indexOf(backEndPlayers[socket.id].playerNumber);
        availablePlayers.splice(pNindex, 1);

        // send new player data to the front end
        io.emit('updateData', backEndPlayers); //emit to the front end; a new player joined

        //lobby logic

        // front end post to notify the backend that a user disconnected
        socket.on('disconnect', (reason) => {
            console.log("disconnected...", reason);
            //add the piece and player number back to the list
            availablePlayers.push(backEndPlayers[socket.id].playerNumber);
            if(backEndPlayers[socket.id].piece) {
                backEndPieces.push(backEndPlayers[socket.id].piece);
            }
            delete backEndPlayers[socket.id];
            if(inLobby) {
                io.emit('update-connected-players', availablePlayers);
            } else {
                console.log("A player disconnected!");
            }
            
        });

        // front end post to update a user's data
        socket.on('new-user-data', (userData) => {
            if(!backEndPieces.includes(userData.selectedPiece)) { //if the piece sent isn't available
                //piece is taken!
                socket.emit('piece-taken', userData.selectedPiece);
            } else {
                backEndPlayers[socket.id].name = userData.username;
                backEndPlayers[socket.id].piece = userData.selectedPiece;
                const pieceInd = backEndPieces.indexOf(backEndPlayers[socket.id].piece);
                backEndPieces.splice(pieceInd, 1);
                socket.emit('game-event', `Name and piece updated!\nName: ${backEndPlayers[socket.id].name}\nPiece: ${backEndPlayers[socket.id].piece}`, messages["success"]);
            }
        });

        // front end request to update the pieces
        socket.on('fe-wants-pieces-updated', () => {
            io.emit('pieces-list', (backEndPieces));
        });

        // ########################### Page Loading ########################### //

        //load in the page we want to display for SPA
        socket.on('load-page', async (page) => {
            console.log(`Loading ${page}.html`);
            filePath = `./public/${page}.html`;
            fs.readFile(filePath, 'utf8', (err, data) => {
                if(err) { 
                    console.log(`Error reading in ${filePath}: ${err.message}`)
                } else {
                    io.emit('update-content', data);
                }
            })
            if(page === "board") {
                inLobby = false;
            }
        });

        // ########################### Chat ########################### //

        socket.on('send-message', (senderID, msg) => {
            if(senderID !== null) {
                msg = `${backEndPlayers[socket.id].name}: ${msg}`;
                io.emit('msg-incoming', msg);
            } else {
                socket.emit('msg-incoming', msg);
            }
        });

        // ########################### Gameflow (Turns, rolling dice, etc.) ########################### //

        socket.on('start-game', () => {
            io.emit('update-pieces', backEndPlayers);
            io.emit('game-event', 'Game started!', messages["success"]);
            inLobby = false;
            // board object with all board spaces and a ton of data
            board = new Board(backEndPlayers);
            i = 0 ;
            // Set turn order (still need to randomize it, for now it is default order 1-8)
            for (const[key, value] of Object.entries(backEndPlayers)) {
                turnOrder[i] = key;
                i++;
            }

            // Randomize turn order
            for (var a = turnOrder.length - 1; a > 0; a--) {
                var b = Math.floor(Math.random() * (a + 1));
                var temp = turnOrder[a];
                turnOrder[a] = turnOrder[b];
                turnOrder[b] = temp;
            }
            console.log("Emitting turn order");
            io.emit('show-player-data', turnOrder);
            io.emit('turn-indicator', turnOrder[currentPlayerTurn]);

            // Send alert to whoevers turn it is
            //Object.keys(backEndPlayers)[currentPlayerTurn]
            io.emit('game-event', `${backEndPlayers[turnOrder[currentPlayerTurn]].name}'s turn!`, messages["info"]);
            console.log("TURN ORDER:", turnOrder);
        });

        socket.on('roll-dice', () => {
            // Check if it is this players turn
            if(socket.id == turnOrder[currentPlayerTurn]) {
                // Check if player already rolled this turn
                if(!diceRolled) {
                    console.log("It is this players turn");
                    // Remove the player from the current position on the board
                    io.emit('remove-piece', socket.id);
                    // Rolls dice and stores info in array (bool rolledDoubles, int numDoubles, int diceTotal, int currentPosition)
                    rollInfo = backEndPlayers[socket.id].rollAndMove(0, board);
                    console.log("Roll info:", rollInfo);
                    io.emit('update-pieces', backEndPlayers);
                    io.emit('game-event', (backEndPlayers[socket.id].name + " rolled " + rollInfo[2] + " and landed on " + board.spaces[rollInfo[3]].name + "."), messages["info"]);
                    space = board.spaces[rollInfo[3]];
                    console.log("Possible message:", rollInfo[4]);
                    if(rollInfo[4].length !== 0) {
                        io.emit('game-event', rollInfo[4], messages["info"]);
                    }

                    // Checking if doubles were rolled

                    numDoubles = rollInfo[1];

                    if (!rollInfo[0]) {
                        diceRolled = true;
                    }
                    else if (numDoubles < 3) {
                        socket.emit('game-event', `You rolled ${rollInfo[2]}. Doubles, roll again! Your position is ${rollInfo[3]}.`, messages["success"]);
                    }
                    else {
                        socket.emit('game-event', '3 doubles! Go to jail!', messages["error"]);
                        diceRolled = true;
                    }
                    // if the player landed a purchasable space, see if they want to buy it
                    if (space instanceof Property || space instanceof Railroad || space instanceof Utility) {
                        if(space.owner instanceof Player && space.owner !== backEndPlayers[socket.id]) {
                            console.log("Space is owned!");
                            if(space instanceof Utility) {
                                const rent = space.payRent(backEndPlayers[socket.id], rollInfo[2]);
                                io.emit('game-event', `${backEndPlayers[socket.id].name} is paying ${rent} to ${space.owner} for landing on their property ${space.name}`, messages["error"]);
                            } else {
                                const rent = space.payRent(backEndPlayers[socket.id]);
                                io.emit('game-event', `${backEndPlayers[socket.id].name} is paying ${rent} to ${space.owner} for landing on their property ${space.name}`, messages["error"]);
                            }
                        } else {
                            console.log("Space is a purchaseable");
                            socket.emit('land-purchase', space.name, space.price);
                        }
                    }
                } 
                // If player already rolled this turn
                else {
                    socket.emit('game-event', "You have finished rolling this turn.", messages["error"]);
                }
            } 
            // If it is not this players turn
            else {
                socket.emit('game-event', "It is not your turn yet!", messages["error"]);
            }
        });

        socket.on('end-turn', () => {
            var turnChanged = false;
            // Check if it is this players turn
            if(socket.id == turnOrder[currentPlayerTurn]) {
                // Check if they have rolled yet
                if(diceRolled) {
                    // Ends turn and sets turn to whoever is next in line
                    socket.emit('game-event', "Your turn is now over.", messages["success"]);
                    if (currentPlayerTurn >= turnOrder.length - 1) {
                        currentPlayerTurn = 0;
                    }
                    else {
                        currentPlayerTurn += 1;
                    }
                    diceRolled = false;
                    turnChanged = true;
                }
                else {
                    socket.emit('game-event', "You haven't rolled yet!", messages["error"]);
                }
            }
            else {
                socket.emit('game-event', "It is not your turn yet!", messages["error"]);
            }

            // Send alert to whoever's turn it is right now if turn changed
            if(turnChanged) {
                io.emit('game-event', `${backEndPlayers[turnOrder[currentPlayerTurn]].name}'s turn!`, messages["info"]);
                console.log("Turn changed to", turnOrder[currentPlayerTurn]);
                io.emit('turn-indicator', turnOrder[currentPlayerTurn]);
            }

        });

        // ########################### Buying Properties/Railroads/Utilities ########################### //

        socket.on('purchase-decision', (spaceName, response) => {
            //get the actual object
            space = board.getSpaceByName(spaceName);
            console.log("Fetched space from the name", space);

            //if the response to buying this property/railroad/utility is YES (true)
            if(response) {
                //set the space's owner to this socket
                space.owner = backEndPlayers[socket.id];
                //subtract the price from the players inventory
                backEndPlayers[socket.id].addMoney(space.price * -1);
                //log the info
                io.emit('game-event', `${backEndPlayers[socket.id].name} has purchased ${space.name}!`, messages["info"]);
                console.log(`${backEndPlayers[socket.id].name} has purchased ${space.name}!`);
                console.log(`The owner of ${space.name} is ${space.owner.name}.`);
                if(space instanceof Railroad) {
                    //we must keep track of number of railroads owned to calculate rent
                    backEndPlayers[socket.id].railroadsOwned++;
                } else if(space instanceof Utility) {
                    //we must keep track of number of utilities owned to calculate rent
                    backEndPlayers[socket.id].utilitiesOwned++;
                }
            } else {
                io.emit('game-event', `${backEndPlayers[socket.id].name} has declined to purchase ${space.name}.`, messages["info"]);
                console.log(`${backEndPlayers[socket.id].name} has declined to purchase ${space.name}.`);
                io.emit('game-event', `${space.name} is now up for auction!`, messages["success"]);
                console.log("Starting auction...");
                startAuction(space);
            }
        });

        // ########################### Auction Stuff ########################### //

        socket.on('bid', (auction_info) => {
            io.emit('game-event', `${backEndPlayers[socket.id].name} has bid $${auction_info.currentBid} on ${auction_info.spaceForAuction}.`, messages["info"])
            console.log(`${backEndPlayers[socket.id].name} has bid $${auction_info.currentBid} on ${auction_info.spaceForAuction}.`)
            //set the current bidder as the one who just bid
            auction_info.currentBidderName = backEndPlayers[socket.id].name;
            auction_info.currentBidderID = socket.id;
            //reset number of passes
            auction_info.numPasses = 0;
            //go to the next player in the order
            auction_info.bidOrderInd+=1;
            console.log("Bid order:", auction_info.bidOrder)
            console.log("Bid order index:", auction_info.bidOrderInd)
            if(auction_info.bidOrderInd > auction_info.bidOrder.length-1) {
                auction_info.bidOrderInd = 0;
            }
            //query the user for their bid or pass
            if(auction_info.currentBidderID !== auction_info.bidOrder[auction_info.bidOrderInd]) {
                console.log("Sending bid request to", backEndPlayers[auction_info.bidOrder[auction_info.bidOrderInd]].name);
                io.to(auction_info.bidOrder[auction_info.bidOrderInd]).emit('your-bid', auction_info);
            } else {
                console.log("Auction ended! Everyone passed after someone bid.")
                // End the auction
                io.emit('auction-ended', auction_info);
                setOwner(auction_info.spaceForAuction, auction_info.currentBidderID);
            }
        });

        socket.on('bid-pass', (auction_info) => {
            console.log(`${backEndPlayers[socket.id].name} has passed on ${auction_info.spaceForAuction}.`)
            // Increment the number of passes
            auction_info.numPasses += 1;
            // Check if everyone has passed
            if (auction_info.numPasses >= auction_info.bidOrder.length - 1 && auction_info.currentBidderID !== null) {
                console.log("Auction ended! Everyone passed after someone bid.")
                // End the auction
                io.emit('auction-ended', auction_info);
                setOwner(auction_info.spaceForAuction, auction_info.currentBidderID);
            } else if(auction_info.numPasses === auction_info.bidOrder.length && auction_info.currentBidderID === null) {
                // If everyone passes and no one has bid yet, the auction is over
                console.log("Auction ended! Everyone passed before someone bid.")
                io.emit('auction-ended', auction_info);
            }
            else {
                console.log("Sending bid request to", backEndPlayers[auction_info.bidOrder[auction_info.bidOrderInd]].name)
                // Set the next bidder
                auction_info.bidOrderInd += 1;
                if (auction_info.bidOrderInd >= auction_info.bidOrder.length) {
                    auction_info.bidOrderInd = 0;
                }
                // Send the next bid to the next bidder
                io.to(auction_info.bidOrder[auction_info.bidOrderInd]).emit('your-bid', auction_info);
            }
        });

        socket.on('surrender', () => {
            console.log(`${backEndPlayers[socket.id].name} has surrendered!`);
            io.emit('game-event', `${backEndPlayers[socket.id].name} has surrendered!`, messages["surrender"]);
            // Remove the player from the turn order
            turnOrder.splice(turnOrder.indexOf(socket.id), 1);
            // Remove the player from the board
            io.emit('remove-piece', socket.id);
            // Remove the player from the front end
            io.emit('player-surrendered', socket.id);
            // Remove the player from the back end
            delete backEndPlayers[socket.id];
            if(Object.keys(backEndPlayers).length === 1) {
                io.emit('player-won', Object.keys(backEndPlayers)[0]);
                return;
            }
            // Check if the player who surrendered was the last player in the turn order
            if (currentPlayerTurn >= turnOrder.length) {
                currentPlayerTurn = 0;
            }
            // Send alert to whoevers turn it is
            io.emit('game-event', `${backEndPlayers[turnOrder[currentPlayerTurn]].name}'s turn!`, messages["info"]);
            console.log("TURN ORDER:", turnOrder);
            io.emit('turn-indicator', turnOrder[currentPlayerTurn]);

        });

        console.log(backEndPlayers);
    } else {
        console.log("Max players in lobby.");
        socket.disconnect(true);
    }
});



// ########################### Auction Functions ########################### //
function startAuction(space) {
    // Start the auction
    console.log("Starting auction...");
    io.emit('auction-started', space.name, space.price);
    // Set the bid order (everyone except the person who started the auction)
    turnOrderCopy = [...turnOrder];
    console.log("Turn order copy:", turnOrderCopy);
    bidOrder = turnOrderCopy.slice(currentPlayerTurn+1, turnOrder.length).concat(turnOrderCopy.slice(0, currentPlayerTurn));

    console.log("BID ORDER:", bidOrder)
    // Set the auction info object
    let auction_info = {
        spaceForAuction: space.name,
        currentBid: space.price,
        bidOrder: bidOrder,
        bidOrderInd: 0,
        // the bidder name and id are the player who currently has the highest bid
        currentBidderName: null,
        currentBidderID: null,
        numPasses: 0, 
        auctionStarterID: turnOrder[currentPlayerTurn]
    };
    console.log("Auction info", auction_info)
    // Send the first bid request to the first bidder
    io.to(auction_info.bidOrder[auction_info.bidOrderInd]).emit('your-bid', auction_info);
}

function setOwner(spaceName, ownerID) {
    space = board.getSpaceByName(spaceName);
    space.owner = backEndPlayers[ownerID];
    return;
}


setInterval(() => {
    io.emit('updateData', backEndPlayers)
    if(!inLobby) {
        io.emit('update-pieces', backEndPlayers);
    }
}, 1000);

//listen on the port

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});




/* BEGIN MONOPOLY GAMEFLOW */
var board = null
var currentBid = 0;
