const query = require('./query.js');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const createError = require('http-errors');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/send_message', function (req, res) {
    const mess = req.body.message;
    const username = req.body.username;
    const friendname = req.body.friendname;
    const arr = [username, friendname];
    arr.sort();
    console.log(username)
    const room = arr[0].toLowerCase() + arr[1].toLowerCase();
    query.save_mess(room, username, mess);

    // Émettez un événement Socket.IO pour informer les clients du nouveau message
    io.to(room).emit('chat message', { sender: username, message: mess });
    console.log("yo")

    res.send(mess);
});

app.get('/conv/:username/:friendname', async function (req, res) {
    arr = []
    arr.push(req.params.username)
    arr.push(req.params.friendname)

    arr.sort()
    room = arr[0].toLowerCase() + arr[1].toLowerCase()
    await query.connection(room)
    const conve = await query.conv(room)
    res.send(conve)

});

app.get('/get_all_conv/:username', async function (req, res) {
    const friends = await query.get_friends(req.params.username)
    console.log(friends)
    data = []
    for (const obj of friends) {
        data.push(obj.room + ':' + obj.last_mess);
    }
    res.send(data)
})

app.get('/get_last_mess/:username/:friendname', async function (req, res) {
    arr = []
    arr.push(req.params.username)
    arr.push(req.params.friendname)

    arr.sort()
    room = arr[0].toLowerCase() + arr[1].toLowerCase()
    const mess = await query.findLastMessageByRoom(room)
    res.send(mess)
})

app.get('/del_room/:room', async function (req, res) {
    room = req.params.room
    const mess = await query.deleteRoom(room)
    res.send(mess)
})

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
    console.log('Un client s\'est connecté');

    socket.on('disconnect', () => {
        console.log('Un client s\'est déconnecté');
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
