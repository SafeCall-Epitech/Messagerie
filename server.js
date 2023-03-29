const query = require('./query.js');
const axios = require('axios');
var http = require('http');
var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors());
var server = http.createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

axios.get('http://localhost:3000/GetUser')
    .then(function (response) {
        console.log(response.data)
    })
axios.get('http://localhost:3000/GetFriend')
    .then(function (response) {
        console.log(response.data)
    })
//5. This function will be executed every time a user connect to the socket through the "/" express route
io.on('connection', function (socket) {
    console.log("A new client connected!");
    socket.on("join_room", data => {
        console.log(data)
        socket.join(data);
    });
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
                // error handling code goes here
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
        console.log("hello")
    })
    // socket.emit("get_list_user", query.get_list_user(function(result){

    // }))
});
server.listen(8000, console.log("listen"));



