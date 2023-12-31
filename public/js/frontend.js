// import socket IO
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// socket is the player connection
const socket = io(); 
socket.emit('load-page', ("lobby"));
var inLobby = true;

const frontEndPlayers = {}; //dictionary of players who connect (socket.id is the key for each player)
var frontEndPieces = [];

//dictionary of colors for different kinds of messages
const messages = {"info": "#8dc6ff", "warning": "#FEBE10", "error": "#fd5c63", "success": "#32de84"};

// ########################### Socket.io ########################### //
socket.on('updateData', (backEndPlayers) => {
    if(inLobby) {
        socket.emit('fe-wants-pieces-updated'); //send the request to update fe pieces
    }
    for (const id in backEndPlayers) { //update frontEndPlayers
        const backEndPlayer = backEndPlayers[id];
        if(!frontEndPlayers[id]) { //if the player exists on the backend but not the frontend
            frontEndPlayers[id] = {
                name: backEndPlayer.name,
                piece: backEndPlayer.piece,
                money: backEndPlayer.money,
                currentPosition:backEndPlayer.currentPosition,
                inJail:backEndPlayer.inJail,
                outOfJailCards:backEndPlayer.outOfJailCards,
                turnsInJail: backEndPlayer.turnsInJail,
                playerNumber: backEndPlayer.playerNumber
            }
        } else { //player exists on the front end and back end

            //Update the player's info
            frontEndPlayers[id].name = backEndPlayer.name;
            frontEndPlayers[id].piece = backEndPlayer.piece;
            frontEndPlayers[id].money = backEndPlayer.money;
            frontEndPlayers[id].currentPosition = backEndPlayer.currentPosition;
            frontEndPlayers[id].inJail = backEndPlayer.inJail;
            frontEndPlayers[id].outOfJailCards = backEndPlayer.outOfJailCards;
            frontEndPlayers[id].turnsInJail = backEndPlayer.turnsInJail;
            frontEndPlayers[id].playerNumber = backEndPlayer.playerNumber;
            frontEndPlayers[id].railroadsOwned = backEndPlayer.railroadsOwned;
            frontEndPlayers[id].houses = backEndPlayer.houses;
            frontEndPlayers[id].motels = backEndPlayer.motels;

            if(inLobby) {
                if(id === socket.id) { //if this is the player connected:
                    createUserForm(id);
                } else { //if this isn't the player's front end (its another player's)
                    updateOtherPlayer(id);
                }
            } else {
                // When in game, this will update the players' stats display
                updatePlayerData();
            }
        }
        for(const id in frontEndPlayers) { //Ensure no players exist on the front end that don't on the backend
            if(!backEndPlayers[id]) {
                if(inLobby) {
                    $(`${frontEndPlayers[id].playerNumber}`).css("background-color", "#3498db");
                }
                delete frontEndPlayers[id];
            }
        }
    }
    //console.log(frontEndPlayers);
});

// updates the location of pieces on the board
socket.on('update-pieces', (backEndPlayers) => {
    for(const id in backEndPlayers) {
        frontEndPlayers[id] = backEndPlayers[id];
        const pieceMapLocation = $(`#space${backEndPlayers[id].currentPosition} .${backEndPlayers[id].playerNumber}`);
        if(pieceMapLocation.find("img").length === 0) {
            const piece = $(`<img>`); //create a new image element
            piece.attr({
                "z-index": "10",
                "src": `../img/${backEndPlayers[id].piece}.png`,
                "alt": `${backEndPlayers[id].piece} piece`,
                "width": "20px",
                "height": "20px"
            });
            pieceMapLocation.append(piece);
        }
        
    }
});

socket.on('remove-piece', (id) => {
    const pieceMapLocation = $(`#space${frontEndPlayers[id].currentPosition} .${frontEndPlayers[id].playerNumber}`);
    pieceMapLocation.empty();
});

socket.on('player-surrendered', (playerID) => {
    //grey out the player's box in the playdata section
    const player_info_box = $(`#${playerID}`);
    $("#app").ready(() => {
        player_info_box.css({"background-color": "black",
                        "border": "1px solid grey",
                        "color": "grey"});
        //set the player's info to nothing
        player_info_box.html(
            `<h3>${frontEndPlayers[id].name}</h3>
            <p>Money: $0</p>
            <p>Position: -</p>
            <p>In Jail: -</p>
            <p>Get Out of Jail Cards: -</p>`
        );
    })
    
    //delete the player from the front end.
    delete frontEndPlayers[playerID];
});

// updates the front end pieces 
socket.on('pieces-list', (backEndPieces) => {
    frontEndPieces = [...backEndPieces];
});

socket.on('piece-taken', (piece) => {
    gameEvent(`The ${piece} piece is taken! Please try again.`, messages["error"]);
});

socket.on('update-connected-players', (unconnected_players) => {
    for(var i = 0; i < unconnected_players.length; i++) {
        var realID = unconnected_players[i].toString();
        document.getElementById(realID).style.backgroundColor = "#3498db";
    }
});

//IMPORTANT SOCKET IO HANDLER: this socket event loads the actual page we want
socket.on('update-content', (content) => {
    document.getElementById('app').innerHTML = content;
    console.log("Attempting to update page content...");
});


// ########################### SPA loading ########################### //


$('#app').on('click', '#startGameButton', () => {
    startGame();
});

$('#app').on('click', '#roll_dice', () => {
    console.log("Roll dice button pressed.");
    socket.emit('roll-dice') ;
});

$('#app').on('click', '#surrender', () => {
    console.log("Surrender button pressed.");
    confirmSurrender();
});

$('#app').on('click', '#end_turn', () => {
    console.log("End turn button pressed.");
    $(`#${socket.id}`).css("background-color", "#f0f0f0");
    socket.emit('end-turn') ;
})

function startGame() {
    const host = getLowestPlayerNumber();
    // if(frontEndPlayers[socket.id].playerNumber == host && validateStart() && Object.keys(frontEndPlayers).length > 1) {
    //     socket.emit('start-game'); }
    if(frontEndPlayers[socket.id].playerNumber != host) {
        gameEvent(`Player ${host} needs to start the game.`, messages["error"]);
    } else if(Object.keys(frontEndPlayers).length <= 1) {
        gameEvent("There must be at least 2 players to begin.", messages["error"]);
    } else if(!validateStart()) {
        gameEvent("All players must enter a name and choose their piece!", messages["error"]);
    } else {
        socket.emit('load-page', ("board"));
        socket.emit('start-game');
        inLobby = false;
    }
}

function validateStart() { //make sure every player has chosen a piece and name
    for(const id in frontEndPlayers) {
        if(!frontEndPlayers[id].name || !frontEndPlayers[id].piece) {
            return false;
        }
    }
    return true;
}

socket.on('show-player-data', (turnOrder) => {
    //this is a failsafe if inLobby isnt already false (it should be here)
    inLobby = false;
    showPlayerStats(turnOrder);
})

function showPlayerStats(turnOrder) {
    console.log("In showPlayerStats!")
    //HTML for player stats (This shows one player)
    // <div class="player-info">
    //     <h3 id="player-name">Player Name</h3>
    //     <p id="player-money">Money: $1000</p>
    //     <p id="player-position">Position: Boardwalk</p>
    //     <p id="player-in-jail">In Jail: No</p>
    //     <p id="player-jail-cards">Get Out of Jail Cards: 2</p>
    // </div>
    const $player_info_container = $('#player-info-container');
    for(var id of turnOrder) {
        const player_info = `<div class="player-info" id="${id}">
                                <h3>${frontEndPlayers[id].name}</h3>
                                <p>Money: $${frontEndPlayers[id].money}</p>
                                <p>Position: ${frontEndPlayers[id].currentPosition}</p>
                                <p>In Jail: ${frontEndPlayers[id].inJail}</p>
                                <p>Get Out of Jail Cards: ${frontEndPlayers[id].outOfJailCards}</p>
                            </div>`;
        $player_info_container.append(player_info);
    }
    $player_info_container.css("visibility", "visible");
}

function updatePlayerData() {
    for(const id in frontEndPlayers) {
        const player_info_box = $(`#${id}`);
        player_info_box.html(
            `<h3>${frontEndPlayers[id].name}</h3>
            <p>Money: $${frontEndPlayers[id].money}</p>
            <p>Position: ${frontEndPlayers[id].currentPosition}</p>
            <p>In Jail: ${frontEndPlayers[id].inJail}</p>
            <p>Get Out of Jail Cards: ${frontEndPlayers[id].outOfJailCards}</p>`
        )
        if(id === socket.id) {
            $(`#${id} h3, #${id} p`).css("color", "#7c73e6");
        }
    }
}

socket.on('turn-indicator', (playerID) => {
    console.log("In turn-indicator", playerID);
    for(const id in frontEndPlayers) {
        if(id === playerID) {
            $(`#${id}`).css("background-color", "lime");
        } else {
            $(`#${id}`).css("background-color", "#f0f0f0");
        }
    }
    $(`#${playerID}`).backgroundColor = "lime";
});

// ########################### Lobby Functions ########################### //
function createUserForm(id) {
    const playerNumber = (frontEndPlayers[id].playerNumber).toString()
    const $playerContainer = $("#" + playerNumber);
    $($playerContainer).css("background-color", 'green');
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

            const submitButton = $("<input>").attr({"type": "submit", "class":"submit-input"}).val("Submit");
            //<input type="submit" value="Submit" class="submit-input">
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
        //move this to the if and make it happen reguardless? then people can change their username and piece after initializing them
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

// ########################### Chat ########################### //
$(document).ready(() => {
    makeDraggable("#chat", "#dragHandle");
    makeResizeable("#chat", "#resizeHandle");

    //Make player stats draggable
});

socket.on('game-event', (msg, color) => {
    const br = $("<br>");
    const gameEventChat = $("#gameEventChat");
    const newMessage = $("<div>").text(`${msg}`);
    newMessage.css("color", color);
    gameEventChat.append(newMessage);
    gameEventChat.append(br);

    //Scroll to the bottom to see the latest messages
    const parentElement = $("#eventContainer")[0]; // Get the DOM element, not the jQuery object
    parentElement.scrollTop = parentElement.scrollHeight;
});

function gameEvent(msg, color) {
    const gameEventChat = $("#gameEventChat");
    const newMessage = $("<div>").text(`${msg}`);
    newMessage.css("color", color);
    gameEventChat.append(newMessage);

    //Scroll to the bottom to see the latest messages
    const parentElement = $("#eventContainer")[0]; // Get the DOM element, not the jQuery object
    parentElement.scrollTop = parentElement.scrollHeight;
}

function makeDraggable(containerSelector, handleSelector) {
    let isDragging = false;
    let offsetX, offsetY;

    $(handleSelector).mousedown((e) => {
        isDragging = true;
        offsetX = e.clientX - $(containerSelector).position().left;
        offsetY = e.clientY - $(containerSelector).position().top;
    });

    $(document).mouseup(() => {
        isDragging = false;
    });

    $(document).mousemove((e) => {
        if(isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            $(containerSelector).css({left:x, top: y});
        }
    });
}

function makeResizeable(containerSelector, handleSelector) {
    let isResizing = false;
    let originalX, originalY, originalWidth, originalHeight;

    $(handleSelector).mousedown((e) => {
        isResizing = true;
        originalX = e.clientX;
        originalY = e.clientY;
        originalWidth = $(containerSelector).width();
        originalHeight = $(containerSelector).height();

        e.preventDefault(); // prevents text selection during resize
    });

    $(document).mousemove((e) => {
        if(isResizing) {
            const deltaX = e.clientX - originalX;
            const deltaY = e.clientY - originalY;

            $(containerSelector).width(originalWidth + deltaX);
            $(containerSelector).height(originalHeight + deltaY);
        }
    });

    $(document).mouseup(() => {
        isResizing = false;
    });
}

$("#send-button").click((e) => {
    e.preventDefault();
    //get the msg from the input box
    const msg = $("#msg-input").val();
    //make sure an empty string isn't being sent
    if(msg.trim() === '') {
        socket.emit('send-message', null, "Enter a message before sending.");
    }
    //as long as the player has chosen a username...
    else if(frontEndPlayers[socket.id].name !== null) {
        //send it to the backend
        socket.emit('send-message', socket.id, msg);
        //Clear the input box
        $('#msg-input').val('');
    } else { //if the player tries to send a message without a username
        socket.emit('send-message', null, "Please enter a name before sending messages.");
    }
});

socket.on('msg-incoming', (msg) => {
    const messageContainer = $('#chat-messages');

    const newMessage = $('<div>').text(`${msg}`);

    messageContainer.append(newMessage);

    //Scroll to the bottom to show the latest messages
    const parentElement = $('#chatContainer')[0]; // Get the DOM element, not the jQuery object
    parentElement.scrollTop = parentElement.scrollHeight;
});

/*** Socketio for the game itself ***/

socket.on('get-board-data', (BE_board) => {
    FE_board = BE_board;
})

// ########################### Property/Railroad/Utility Handling ########################### //

socket.on('land-purchase', (propertyName, propertyPrice) => {
    console.log(`Would you like to purchase ${propertyName} for ${propertyPrice}?`);
    // const msg = `Would you like to purchase ${propertyName} for ${propertyPrice}?`;
    // const response = confirm(msg);
    const modalContent = createPurchaseModal(propertyName, propertyPrice);
    $('#modal').empty();
    $('#modal').append(modalContent);
    $('#modal').css("visibility", "visible");
    //$('#modal').show();
    $('#purchase-yes').on('click', () => {
        socket.emit('purchase-decision', propertyName, true);
        $('#modal').empty();
        //$('#modal').hide();
        $('#modal').css("visibility", "hidden");
    });
    $('#purchase-no').on('click', () => {
        socket.emit('purchase-decision', propertyName, false);
        $('#modal').empty();
        //$('#modal').hide();
        $('#modal').css("visibility", "hidden");
    });
});
function createPurchaseModal(spaceName, propertyPrice) {
    const modalContent = $('<div>').addClass('modal-content');
    const message = $('<p>').text(`Would you like to purchase ${spaceName} for $${propertyPrice}?`);
    const yesButton = $('<button>').text('Buy').attr('id', 'purchase-yes');
    const noButton = $('<button>').text('Pass').attr('id', 'purchase-no');

    modalContent.append(message, yesButton, noButton);

    return modalContent;
}
// ########################### Auction Handling ########################### //

socket.on('auction-started', (spaceName, spacePrice) => {
    gameEvent(`Auction for ${spaceName} has started!\nStarting bid is ${spacePrice}`, messages["info"]);
    console.log(`Auction for ${spaceName} has started!\nStarting bid is ${spacePrice}`);
});

socket.on('your-bid', (auction_info) => {
    const modalContent = createAuctionModal(auction_info.propertyName, auction_info.currentBid, auction_info.currentBidderName);
    $('#modal').empty();
    $('#modal').append(modalContent);
    //$('#modal').show();
    $('#modal').css("visibility", "visible");
    $('#passButton').on('click', () => {
        console.log('passing');
        socket.emit('bid-pass', auction_info);
        console.log("Emptying and hiding modal");
        $('#modal').empty();
        //$('#modal').hide();
        $('#modal').css("visibility", "hidden");
    });
    $('#submitBid').on('click', () => {
        const bid = parseInt($('#bidBox').val());
        // if the bid is less than the starting bid
        if (bid < auction_info.currentBid && auction_info.currentBidderID === null) {
            console.log('passing, starting bid too low');
            socket.emit('bid-pass', auction_info);
        } 
        // if the bid is less than or equal the bid by someone else
        else if(bid <= auction_info.currentBid && auction_info.currentBidderID !== null) {
            console.log("auction_info.currentBidderID !== null:", auction_info.currentBidderID !== null)
            console.log('passing, bid lower than current bid', auction_info.currentBid);
            socket.emit('bid-pass', auction_info);
        } 
        // if the bid entered is nothing (empty string)
        else if(bid === NaN) {
            console.log('passing, entered nothing');
            socket.emit('bid-pass', auction_info);
        } 
        // a valid bid was entered
        else {
            auction_info.currentBid = bid;
            console.log('submitting bid');
            socket.emit('bid', auction_info, bid);
        }
        console.log("Emptying and hiding modal");
        $('#modal').empty();
        //$('#modal').hide();
        $('#modal').css("visibility", "hidden");
    });
});

function createAuctionModal(spaceName, currentBid, currentBidder) {
    const modalContent = $('<div>').addClass('modal-content');
    let message;
    if(!currentBidder) {
        message = $('<p>').text(`Would you like to bid on ${spaceName}?\nStarting bid is $${currentBid}.`);
    } else {
        message = $('<p>').text(`Would you like to bid on ${spaceName}?\nCurrent bid is $${currentBid} by ${currentBidder}.`);
    }
    const bidBox = $('<input>').attr({
        'id': 'bidBox',
        'type': 'number',
        'placeholder': 'Enter bid here'
    });
    const submitBid = $('<button>').text('Bid').attr('id', 'submitBid');
    const passButton = $('<button>').text('Pass').attr('id', 'passButton');

    modalContent.append(message, bidBox, submitBid, passButton);

    return modalContent;
}

socket.on('auction-ended', (auction_info) => {
    if(auction_info.currentBidderID === null) {
        console.log(`No one bid on ${auction_info.spaceForAuction}.\n Game continues...`)
        gameEvent(`No one bid on ${auction_info.spaceForAuction}.\n Game continues...`, messages["info"]);
    } else {
        console.log(`${auction_info.currentBidderName} won the auction for ${auction_info.spaceForAuction}!`);
        gameEvent(`${auction_info.currentBidderName} won the auction for ${auction_info.spaceForAuction}!`, messages["info"]);
    }
});

// ########################### Surrendering ########################### //

function confirmSurrender() {
    const modalContent = createSurrenderModal();
    $('#modal').empty();
    $('#modal').append(modalContent);
    //$('#modal').show();
    $('#modal').css("visibility", "visible");
    $('#surrender-yes').on('click', () => {
        socket.emit('surrender');
        $('#modal').empty();
        //$('#modal').hide();
        $('#modal').css("visibility", "hidden");
    });
    $('#surrender-no').on('click', () => {
        $('#modal').empty();
        //$('#modal').hide();
        $('#modal').css("visibility", "hidden");
    });
}

function createSurrenderModal() {
    const modalContent = $('<div>').addClass('modal-content');
    const message = $('<p>').text(`Are you sure you want to surrender?`);
    const yesButton = $('<button>').text('Yes').attr('id', 'surrender-yes');
    const noButton = $('<button>').text('No').attr('id', 'surrender-no');

    modalContent.append(message, yesButton, noButton);

    return modalContent;
}

socket.on('player-won', (playerID) => {
    gameEvent(`${frontEndPlayers[playerID].name} won the game!`, "#6B5B95");
    console.log(`${frontEndPlayers[playerID].name} won the game!`);
    const victory = createVictoryModal(playerID);
    $('#modal').empty();
    $('#modal').append(victory);
    $('#modal').css("visibility", "visible");
});

function createVictoryModal(playerID) {
    const modalContent = $('<div>').addClass('modal-content');
    const message = $('<p>').text(`${frontEndPlayers[playerID].name} won the game!`);
    const okButton = $('<button>').text('Ok').attr('id', 'ok-button');

    modalContent.append(message, okButton);

    modalContent.css({
        'background-color': '#3498db',  // Blue background color
        'color': '#fff',                // White text color
        'border-radius': '8px',         // Rounded corners
        'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.3)',  // Shadow for depth
        'padding': '20px',              // Padding for content
    });

    okButton.css({
        'background-color': '#2ecc71',  // Green button color
        'color': '#fff',                // White text color
        'border': 'none',               // No border
        'border-radius': '4px',         // Rounded corners
        'cursor': 'pointer',            // Pointer cursor on hover
        'font-size': '16px',            // Font size
        'margin-top': '10px',           // Top margin for button
    });

    return modalContent;
}