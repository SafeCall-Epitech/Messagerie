const query = require('./query.js');
const axios = require('axios');
var http = require('http');
var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors());
var server = http.createServer(app);
var name = ""
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on('connection', function (socket) {
    console.log("A new client connected!");
    console.log(name)
    socket.on("join_room", data => {
        console.log(data)
        socket.join(data);
    });
    socket.on("GetUserName", data => {
        axios.get('http://localhost:3001/GetUser')
            .then(function (response) {
                socket.emit("UserName", response.data)
            })
    })
    socket.on("join_friend", data => {
        query.connection(data)
        query.get_conv(data, function (dt, err) {
            if (err) {
                // error handling code goes here
                console.log("ERROR : ", err);
            } else {
                console.log(dt)
                io.to(data).emit('r_mess_first', dt)

            }

        });
    })
    socket.on('s_mess', data => {
        if (data.room != "") {
            io.to(data.room).emit('r_mess', data)
            query.save_mess(data.room, data.username, data.text)
        }
        // query.get_list_user(function (data) {
        //     console.log(data)
        // })
        // console.log(query.get_list_user())
    })
    socket.on("connection", data => {
        query.get_friends(data, function (dt, err) {
            if (err) {
                console.log("ERROR : ", err);
            } else {
                var a = []
                for (const d of dt) {
                    e = d.TABLE_NAME.split("_")
                    if (e[0] === data)
                        a.push(e[1])
                    else
                        a.push(e[0])
                }
                console.log(a)
                socket.emit('get_friend', a)
            }

        });
    })
    // socket.emit("get_list_user", query.get_list_user(function (result) {
    //     console.log(result)
    // }))
});

server.listen(8000, console.log("listen"));


