var ws_uri = "ws://treemote.xyz/monopoly:9600";
var websocket = new WebSocket(ws_uri);

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

