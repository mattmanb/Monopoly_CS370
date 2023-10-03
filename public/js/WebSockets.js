//this initializes the websockets
var ws_uri = "ws://localhost:9600";
var websocket = new WebSocket(ws_uri);
console.log("websocket initialized");

/*   EVENT HANDLERS   */

// when the websocket opens:
websocket.onopen = function(event) {
    MessageAdd('<div class="message green">You have entered the chat room.</div>');
};

// when the websocket closes:
websocket.onclose = function(event) {
    MessageAdd('<div class="message blue">You have been disconnected.</div>');
};

// when there is a websocket error:
websocket.onerror = function(event) {
    MessageAdd('<div class="message red">Connection to chat failed.</div>');
};

// onmessage event handler
websocket.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if(data.type == "message") {
        MessageAdd('<div class=message">' + data.username + ': ' + data.message + '</div>');
    }
};

/*   Submitting form data with websockets   */

document.getElementById("chat-form").addEventListener("submit", function(e) { //add a listener to "chat-form"
    e.preventDefault(); //prevents page from refreshing (text is gone before you can see it)

    var message_element = document.getElementsByTagName("input")[0];
    var message = message_element.value;

    if(message.toString().length) { //if the message is at least 1 character long
        var username = localStorage.getItem("username");

        var data = {
            type:"message",
            username: username,
            message: message
        };

        websocket.send(JSON.stringify(data)); //data object is stringified then sent to the server
        message_element.value = ""; //clear the input field
    }
}, false);

/*   Creating a username   */

const frontEndPlayers = {}

function Username() {
    var username = window.prompt("Enter your username:", "");

    if(username.toString().length > 2) {
        localStorage.setItem("username", username);
    }
    else {
        alert("Your username must be at least two characters.");
        Username();
    }
}

//prompt the user for their username
Username();

/*    Displaying the chatroom messages   */
function MessageAdd(message) {
    var chat_messages = document.getElementById("chat-messages");
    var chat = document.getElementById("chat");

    chat_messages.insertAdjacentHTML("beforebegin", message); //inserts the message into the "chat-messages" container
    chat.scrollTop = chat.scrollHeight;
}