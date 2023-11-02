// import socket IO
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// socket is the player connection
const socket = io(); 

// Need to set as type module in HTML for this to work
import { player } from './classes/player.js';
import { property } from './classes/property.js'
import { chance_card } from './classes/chance_card.js'
import { community_chest_card } from './classes/community_chest_card.js'

const frontEndPlayers = {}; //dictionary of players who connect (socket.id is the key for each player)
var frontEndPieces = [];

socket.on('updatePlayers', (backEndPlayers) => {
    for (const id in backEndPlayers) { //update frontEndPlayers
        const backEndPlayer = backEndPlayers[id];
        if(!frontEndPlayers[id]) {
            frontEndPlayers[id] = new player({ 
                playerNumber: backEndPlayer.playerNumber
            })
        } else {
            frontEndPlayers[id].name = backEndPlayers[id].name;
            frontEndPlayers[id].piece = backEndPlayers[id].piece;  
            if(id === socket.id) { //all this stuff is the username and piece entry
                $(() => {
                    var id = (frontEndPlayers[socket.id].playerNumber).toString();
                    const $playerContainer = $("#" + id);
                    $($playerContainer).css("background-color", 'green');
                    if($playerContainer.find("form").length === 0) {
                        //creates the form for a player to enter username and piece
                        const form = $("<form>");

                        const usernameLabel = $("<label>").text("Username: ");
                        const usernameInput = $("<input>").attr("type", "text").attr("name", "username");

                        const pieceLabel = $("<label>").text("Choose your piece: ");
                        const pieceSelect = $("<select>").attr("name", "piece");

                        $.each(frontEndPieces, function(index, value) {
                            pieceSelect.append($("<option>").attr("value", value).text(value));
                        })

                        const submitButton = $("<input>").attr("type", "submit").val("Submit");

                        form.append(usernameLabel, usernameInput, pieceLabel, pieceSelect, submitButton);

                        $playerContainer.append(form);
                        
                        form.on("submit", (event) => {
                            event.preventDefault();

                            const username = usernameInput.val();
                            const selectedPiece = pieceSelect.val();
                            frontEndPieces.splice(frontEndPieces.indexOf(selectedPiece), 1);
                            socket.emit('update-pieces', frontEndPieces);

                            socket.emit('new-user-data', { username, selectedPiece })

                            alert(`Username: ${username}\nPiece: ${selectedPiece}`);
                        })
                    
                    }
                })    
            } else {
                document.getElementById((frontEndPlayers[id].playerNumber).toString()).style.backgroundColor = "red";
            }
        }
        for(const id in frontEndPlayers) {
            if(!backEndPlayers[id]) {
                delete frontEndPlayers[id];
            }
        }
    }
    //console.log(frontEndPlayers);
});

// updates the front end pieces 
socket.on('pieces-list', (backEndPieces) => {
    frontEndPieces = [...backEndPieces];
})

socket.on('update-connected-players', (unconnected_players) => {
    for(var i = 0; i < unconnected_players.length; i++) {
        var realID = unconnected_players[i].toString();
        document.getElementById(realID).style.backgroundColor = "#3498db";
    }
})

socket.on('game-starting', (route) => {
    window.location.href = route;
})

$("#startGameButton").click(function() {
    startGame();
});

function startGame() {
    const host = getLowestPlayerNumber();
    // if(frontEndPlayers[socket.id].playerNumber == host && validateStart() && Object.keys(frontEndPlayers).length > 1) {
    //     socket.emit('start-game'); }
    if(frontEndPlayers[socket.id].playerNumber != host) {
        alert(`Player ${host} needs to start the game.`);
    } else if(Object.keys(frontEndPlayers).length <= 1) {
        alert("There must be at least 2 players to begin.");
    } else if(!validateStart()) {
        console.log(host, frontEndPlayers[socket.id].playerNumber)
        alert("All players must enter a name and choose their piece!");
    } else {
        socket.emit('start-game');
    }
}

function getLowestPlayerNumber() { //basically choose who can start the game
    var min = 9;
    for(const id in frontEndPlayers) {
        if(frontEndPlayers[id].playerNumber < min) {
            min = frontEndPlayers[id].playerNumber;
        }
    }
    return min;
}

function validateStart() { //make sure every player has chosen a piece and name
    for(const id in frontEndPlayers) {
        console.log(id, frontEndPlayers[id]);
        if(!frontEndPlayers[id].name || !frontEndPlayers[id].piece) {
            return false;
        }
    }
    return true;
}