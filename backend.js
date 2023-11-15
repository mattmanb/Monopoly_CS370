//assume the backend is the most critical in terms of data (don't rely on
//front end post requests!)

import { player } from './classes/player.js';
import { property } from './classes/property.js';
import { chance_card } from './classes/chance_card.js';
import { community_chest_card } from './classes/community_chest_card.js';
import { railroad } from './classes/railroad.js';
import { utility } from './classes/utility.js';

const fs = require('fs');

/*   Server setup   */
//express server
const express = require('express');
const app = express(); //here is the express server

//http server
const http = require('http')
const server = http.createServer(app) //creates http server wrapped around express server

//Socket.io server
const { Server } = require('socket.io')
const io = new Server(server, { 
    pingInterval:2000,
    pingTimeout:5000
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

io.on('connection', (socket) => {
    console.log('a user connected');
    if(availablePlayers.length > 0) {
        //emit the pieces to the front end
        socket.emit('pieces-list', backEndPieces);
        //initialize a player's data
        backEndPlayers[socket.id] = {
            name: null,
            piece: null,
            money: 1500,
            position: 0,
            inJail: false,
            outOfJailCards: 0,
            turnsInJail: 0,
            playerNumber: Math.min(...availablePlayers)
        };
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