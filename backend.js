/*   Server setup   */
//express server
const express = require('express')
const app = express() //here is the express server
console.log("express app Started.")

//http server
const http = require('http')
const server = http.createServer(app) //creates http server wrapped around express server
console.log("http server Started.")

//Socket.io server
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval:2000, pingTimeout:5000 }) //socket.io server wrapped around http server wrapped around express server (say that 10 times fast)
console.log("socket.io server Started.")
/*   End Server setup   */

const port = 3000 //changable later

app.use(express.static('public')) //this makes the public directory accessible to the public (F12 on the page)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html') // NEED TO CHANGE THIS IF THE MAIN HTML PAGE ISNT 'index.html'
})

/* Start backend stuff */
const backEndPlayers = {}

io.on('connection', (socket) => {
    console.log('a user connected')
    backEndPlayers[socket.id] = {
        name: null,
        piece: null,
        money: 1500,
        position: 0,
        inJail: false,
        turnsInJail: 0
    }

    io.emit('updatePlayers', backEndPlayers) //emit to the front end; a new player joined

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete backEndPlayers[socket.id]
        io.emit('updatePlayers', backEndPlayers)
    })
})

function getUsername() {
    const Username = prompt("Enter your username:");

    if(Username.toString().length > 2) {
        return Username.toString();
    }
    else {
        alert("Your username must be at least two characters.");
        getUsername();
    }
}

setInterval(() => {
    io.emit('updatePlayers', backEndPlayers)
}, 1000)

//listen on the port

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})