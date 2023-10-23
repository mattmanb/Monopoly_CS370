/*   Server setup   */
//express server
const express = require('express')
const app = express() //here is the express server

//http server
const http = require('http')
const server = http.createServer(app) //creates http server wrapped around express server

//Socket.io server
const { Server } = require('socket.io')
const io = new Server(server, { 
    pingInterval:2000,
    pingTimeout:5000
}) //socket.io server wrapped around http server wrapped around express server (say that 10 times fast)
/*   End Server setup   */

const port = 3000 //changable later

app.use(express.static('public')) //this makes the public directory accessible to the public (F12 on the page)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // NEED TO CHANGE THIS IF THE MAIN HTML PAGE ISNT 'index.html'
})

app.get('/play', (req, res) => {
    res.sendFile(__dirname + '/public/board.html');
})

app.get('/options', (req, res) => {
    res.sendFile(__dirname + '/public/options.html');
})

/* Start backend stuff */
const backEndPlayers = {}

var backEndPieces = ["Thimble", "Shoe", "Top Hat", 
                     "Wheelbarrow", "Battleship", 
                     "Racecar", "Dog", "Cat"];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('pieces-list', backEndPieces);
    backEndPlayers[socket.id] = {
        name: null,
        piece: null,
        money: 1500,
        position: 0,
        inJail: false,
        turnsInJail: 0,
        playerNumber: -1//NEED THIS VALUE TO BE THE LOWEST NUMBER BETWEEN 1 AND 8 THAT ISN'T ALREADY A PLAYERNUMBER
    };

    io.emit('updatePlayers', backEndPlayers); //emit to the front end; a new player joined

    socket.on('disconnect', (reason) => {
        console.log("disconnected...", reason);
        delete backEndPlayers[socket.id];
        io.emit('updatePlayers', backEndPlayers);
    })

    socket.on('new-user-data', (userData) => {
        backEndPlayers[socket.id] = {
            name: userData.username,
            piece: userData.piece
        }
    })

    // front end request that a piece was taken
    socket.on('update-pieces', (frontEndPieces) => {
        backEndPieces = [...frontEndPieces];
        console.log("backend pieces updated!", backEndPieces);
        io.emit('pieces-list', (backEndPieces));
    })

    console.log(backEndPlayers);
});

setInterval(() => {
    io.emit('updatePlayers', backEndPlayers)
}, 1000);

//listen on the port

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})