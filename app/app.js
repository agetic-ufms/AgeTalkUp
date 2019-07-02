const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use('/', express.static('public'))

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.render('index')
})

let clients = {}

io.on("connection", (client) => {
    client.on("join", function (name) {
        console.log("Joined: " + name);
        clients[client.id] = name;
        client.broadcast.emit("join", name)
    });

    client.on("send", function (msg) {
        console.log("Message: ", msg);
        if (clients[client.id]) {
            client.broadcast.emit("send", clients[client.id], msg.text);
        }
    });

    client.on("disconnect", function () {
        console.log("Disconnect: " + clients[client.id]);
        if (clients[client.id]) {
            io.emit("disconnect", clients[client.id]);
            delete clients[client.id];
        }
    });
})


server.listen(3030);