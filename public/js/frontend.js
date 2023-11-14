// Need to set as type module in HTML for this to work
import { player } from './classes/player.js';

// import socket IO
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// socket is the player connection
const socket = io(); 
socket.emit('load-page', ("lobby"))
var inLobby = true;

const frontEndPlayers = {}; //dictionary of players who connect (socket.id is the key for each player)
var frontEndPieces = [];

/*** Start socket.io ***/
socket.on('updateLobby', (backEndPlayers) => {
    if(inLobby) {
        socket.emit('fe-wants-pieces-updated'); //send the request to update fe pieces
    }
    for (const id in backEndPlayers) { //update frontEndPlayers
        const backEndPlayer = backEndPlayers[id];
        if(!frontEndPlayers[id]) { //if the player exists on the backend but not the frontend
            frontEndPlayers[id] = new player({
                name: backEndPlayer.name,
                piece: backEndPlayer.piece,
                money: backEndPlayer.money,
                position:backEndPlayer.position,
                inJail:backEndPlayer.inJail,
                outOfJailCards:backEndPlayer.outOfJailCards,
                turnsInJail: backEndPlayer.turnsInJail,
                playerNumber: backEndPlayer.playerNumber
            })
        } else { //player exists on the front end and back end

            //Update the player's info
            frontEndPlayers[id].name = backEndPlayer.name,
            frontEndPlayers[id].piece = backEndPlayer.piece,
            frontEndPlayers[id].money = backEndPlayer.money,
            frontEndPlayers[id].position = backEndPlayer.position,
            frontEndPlayers[id].inJail = backEndPlayer.inJail,
            frontEndPlayers[id].outOfJailCards = backEndPlayer.outOfJailCards,
            frontEndPlayers[id].turnsInJail = backEndPlayer.turnsInJail,
            frontEndPlayers[id].playerNumber = backEndPlayer.playerNumber 

            if(inLobby) {
                if(id === socket.id) { //if this is the player connected:
                    createUserForm(id);
                } else { //if this isn't the player's front end (its another player's)
                    updateOtherPlayer(id);
                }
            }
        }
        for(const id in frontEndPlayers) { //Ensure no players exist on the front end that don't on the backend
            if(!backEndPlayers[id]) {
                const player_box = document.getElementById((frontEndPlayers[id].playerNumber).toString())
                if(inLobby) {
                    player_box.style.backgroundColor = "#3498db";
                }
                delete frontEndPlayers[id];
            }
        }
    }
    //console.log(frontEndPlayers);
});

// updates the front end pieces 
socket.on('pieces-list', (backEndPieces) => {
    frontEndPieces = [...backEndPieces];
});

socket.on('piece-taken', (piece) => {
    alert(`The ${piece} piece is taken! Please try again.`)
});

socket.on('update-connected-players', (unconnected_players) => {
    for(var i = 0; i < unconnected_players.length; i++) {
        var realID = unconnected_players[i].toString();
        document.getElementById(realID).style.backgroundColor = "#3498db";
    }
});

socket.on('player-alert', (msg) => {
    alert(msg);
});

//IMPORTANT SOCKET IO HANDLER: this socket event loads the actual page we want
socket.on('update-content', (content) => {
    document.getElementById('app').innerHTML = content;
    console.log("Attempting to update app")
});

// End socket.io ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// START SPA dynamic loading  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$('#app').on('click', '#startGameButton', () => {
    startGame();
    inLobby = false;
});

$('#app').on('click', '#back_to_home', () => {
    inLobby = true;
    socket.emit('load-page', ("lobby"));
})

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
        socket.emit('load-page', ("board"));
    }
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

// END SPA dynamic loading //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Lobby functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createUserForm(id) {
    const playerNumber = (frontEndPlayers[id].playerNumber).toString()
    const $playerContainer = $("#" + playerNumber);
    $($playerContainer).css("background-color", 'green');
    console.log(`Creating user form, username: ${!frontEndPlayers[id].name}`);
    if(!frontEndPlayers[id].name) 
    {
        if($playerContainer.find("form").length === 0) {
            //creates the form for a player to enter username and piece WITH jquery
            const form = $("<form>");

            const usernameLabel = $("<label>").text("Username: ");
            const usernameInput = $("<input>").attr("type", "text").attr("name", "username");

            const pieceLabel = $("<label>").text("Choose your piece: ");
            const pieceSelect = $("<select>").attr("name", "piece");

            $.each(frontEndPieces, function(index, value) {
                pieceSelect.append($("<option>").attr("value", value).text(value));
            });

            const submitButton = $("<input>").attr("type", "submit").val("Submit");

            form.append(usernameLabel, usernameInput, pieceLabel, pieceSelect, submitButton);

            $playerContainer.append(form);
            
            form.on("submit", (event) => {
                event.preventDefault();

                const username = usernameInput.val();
                const selectedPiece = pieceSelect.val();

                socket.emit('new-user-data', { username, selectedPiece });
            });
        } 
    } 
    else 
    {
            const player_info_element = `#${playerNumber} p:first`;
            const player_info = "<pre>" + "Name: " + frontEndPlayers[id].name + '\n' + "Piece: " + frontEndPlayers[id].piece + "</pre>";
            $(player_info_element).html(player_info)
    }
}

function updateOtherPlayer(id) {
    const playerNumber = (frontEndPlayers[id].playerNumber).toString();
    const $player_box = $("#" + playerNumber);
    //set other players who connect to the lobby to having a red background
    $player_box.css("background-color", "red");
    if(frontEndPlayers[id].name && frontEndPlayers[id].piece) { //if another player entered there username and piece, display it in their box
        const player_info = "<pre>" + "Name: " + frontEndPlayers[id].name + '\n' + "Piece: " + frontEndPlayers[id].piece + "</pre>";
        $player_box.html(player_info);
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

//END lobby functions ***************************************************************************************************************************************************************************************************************************************