//assume the backend is the most critical in terms of data (don't rely on
//front end post requests!)

//can't use import/export statements without making this a 'module'
//this syntax works instead
const Player = require('./public/js/classes/player.js');
const Property = require('./public/js/classes/property.js');
const Chance_Card = require('./public/js/classes/chance_card.js');
const Community_Chest_Card = require('./public/js/classes/community_chest_card.js');
const Railroad = require('./public/js/classes/railroad.js');
const Utility = require('./public/js/classes/utility.js');
const Avenue = require('./public/js/classes/avenue.js')
const Board = require('./public/js/classes/board.js');

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
                     "Racecar", "Dog", "Cat"];

var availablePlayers = [1, 2, 3, 4, 5, 6, 7, 8];

var inLobby = true;

// Vars for checking who's turn it is
var turnOrder = [];
var numDoubles = 0;
var currentPlayerTurn = 1;
var diceRolled = false ;

io.on('connection', (socket) => {
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
        io.emit('updateLobby', backEndPlayers); //emit to the front end; a new player joined

        // front end post to notify the backend that a user disconnected
        socket.on('disconnect', (reason) => {
            console.log("disconnected...", reason);
            //add the piece and player number back to the list
            availablePlayers.push(backEndPlayers[socket.id].playerNumber);
            if(backEndPlayers[socket.id].piece) {
                backEndPieces.push(backEndPlayers[socket.id].piece);
            }
            delete backEndPlayers[socket.id];
            io.emit('update-connected-players', availablePlayers);
            io.emit('updateLobby', backEndPlayers);
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
                socket.emit('player-alert', `Name and piece updated!\nName: ${backEndPlayers[socket.id].name}\nPiece: ${backEndPlayers[socket.id].piece}`);
            }
            
        });

        // front end request to update the pieces
        socket.on('fe-wants-pieces-updated', () => {
            io.emit('pieces-list', (backEndPieces));
        })

        //new data from a FE player
        socket.on('update-player', (frontEndPlayer) => {
            backEndPlayer = {
                name: frontEndPlayer.name,
                piece: frontEndPlayer.piece,
                money: frontEndPlayer.money,
                position: frontEndPlayer.currentPosition,
                inJail: frontEndPlayer.inJail,
                outOfJailCards: frontEndPlayer.outOfJailCards,
                turnsInJail: frontEndPlayer.turnsInJail,
                playerNumber: frontEndPlayer.playerNumber
            };
            io.emit('update-players', backEndPlayers);
        });

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

        socket.on('send-message', (senderID, msg) => {
            if(senderID !== null) {
                msg = `${backEndPlayers[socket.id].name}: ${msg}`;
                io.emit('msg-incoming', msg);
            } else {
                socket.emit('msg-incoming', msg);
            }
        });

        socket.on('start-game', () => {
            inLobby = false;
            i = 0 ;
            // Set turn order (still need to randomize it, for now it is default order 1-8)
            for (const[key, value] of Object.entries(backEndPlayers)) {
                turnOrder[i] = value.playerNumber;
                i++;
            }
            // Send alert to whoevers turn it is
            io.to(Object.keys(backEndPlayers)[currentPlayerTurn]).emit('player-alert', 'Your turn!')
            console.log(turnOrder);
        });

        socket.on('roll-dice', () => {
            // Check if it is this players turn
            if(backEndPlayers[socket.id].playerNumber == turnOrder[currentPlayerTurn]) {
                // Check if player already rolled this turn
                if(!diceRolled) {
                    console.log("It is this players turn");
                    // Rolls dice and stores info in array (bool rolledDoubles, int numDoubles, int diceTotal, int currentPosition)
                    rollInfo = backEndPlayers[socket.id].rollAndMove(0, board, socket);
                    space = board.spaces[rollInfo[3]];

                    // Checking if doubles were rolled

                    numDoubles = rollInfo[1];

                    if (!rollInfo[0]) {
                        socket.emit('player-alert', `You rolled ${rollInfo[2]}. Your position is ${rollInfo[3]}.`);
                        diceRolled = true;
                    }
                    else if (numDoubles < 3) {
                        socket.emit('player-alert', `You rolled ${rollInfo[2]}. Doubles, roll again! Your position is ${rollInfo[3]}.`);
                    }
                    else {
                        socket.emit('player-alert', '3 doubles! Go to jail!');
                        diceRolled = true;
                    }

                    if (space instanceof Property || space instanceof Railroad || space instanceof Utility) {
                        console.log("Space is a purchaseable");
                        socket.emit('land-purchase', space.name, space.price);
                    } 
                } 
                // If player already rolled this turn
                else {
                    socket.emit('player-alert', "You have finished rolling this turn.")
                }
            } 
            // If it is not this players turn
            else {
                socket.emit('player-alert', "It is not your turn yet!")
            }
        });

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
                console.log(`${backEndPlayers[socket.id].name} has purchased ${space.name}!`);
                console.log(`The owner of ${space.name} is ${space.owner.name}.`);
            } else {
                console.log(`${backEndPlayers[socket.id].name} has declined to purchase ${space.name}.`);
                console.log("Starting auction...");
                startAuction(space);
            }
        });

        socket.on('auction-bid', (spaceName, bid) => {
            //get the actual object
            space = board.getSpaceByName(spaceName);
            //if the bid is greater than the current bid
            if(bid > space.currentBid) {
                //set the current bid to the new bid
                space.currentBid = bid;
                //set the current bidder to this socket
                space.currentBidder = backEndPlayers[socket.id];
                //log the info
                console.log(`${backEndPlayers[socket.id].name} has bid ${bid} on ${space.name}!`);
            } else {
                console.log(`${backEndPlayers[socket.id].name} has bid ${bid} on ${space.name}.`);
                console.log("That bid is too low!");
            }
        });

        socket.on('end-turn', () => {
            var turnChanged = false;
            // Check if it is this players turn
            if(backEndPlayers[socket.id].playerNumber == turnOrder[currentPlayerTurn]) {
                // Check if they have rolled yet
                if(diceRolled) {
                    // Ends turn and sets turn to whoever is next in line
                    socket.emit('player-alert', "Your turn is now over.")
                    if (currentPlayerTurn >= Object.keys(turnOrder).length - 1) {
                        currentPlayerTurn = 0;
                    }
                    else {
                        currentPlayerTurn += 1;
                    }
                    diceRolled = false;
                    turnChanged = true;
                }
                else {
                    socket.emit('player-alert', "You haven't rolled yet!")
                }
            }
            else {
                socket.emit('player-alert', "It is not your turn yet!")
            }

            // Send alert to whoever's turn it is right now if turn changed
            if(turnChanged) {
                io.to(Object.keys(backEndPlayers)[currentPlayerTurn]).emit('player-alert', 'Your turn!')
            }

        });

        console.log(backEndPlayers);
    } else {
        console.log("Max players in lobby.");
        socket.disconnect(true);
    }
});

setInterval(() => {
    io.emit('updateLobby', backEndPlayers)
}, 1000);

//listen on the port

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

/* BEGIN MONOPOLY GAMEFLOW */
// board object with all board spaces and a ton of data
const board = new Board(io);

function startAuction(space) {
    
}