const query = require('./query.js');
const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
const arr = []
var room = ""
var username

axios.get('http://localhost:3001/GetUser')
    .then(function (response) {
        username = response.data
        arr.push(response.data)
        axios.get('http://localhost:3001/GetFriend')
            .then(function (response) {
                arr.push(response.data)
                arr.sort()
                room = arr[0].toLowerCase() + '_' + arr[1].toLowerCase()
                query.connection(room)

            })
    }).catch(function (error) {
        console.log("ok")
    })

app.get('/room', function (req, res) {
    res.send(room)
    app.get('/conv', function (req, res) {
        query.get_conv(room, function (dt, err) {
            if (err) {
                // error handling code goes here
                console.log("ERROR : ", err);
            } else {
                console.log(dt)
                res.send(dt)

            }

        });
    })
})

axios.get('http://localhost:3001/send_message')
    .then(function (response) {
        console.log(response.data[2])
        query.save_mess(response.data[2], response.data[0], response.data[1])

    }).catch(function (error) {
        console.log("ok")
    })


app.get('/get_all_conv', function (req, res) {
    query.get_friends(username, function (dt, err) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            console.log(dt)
            res.send(dt)

        }

    });
})
// app.set('/receive_message/', function (req, res) {
//     req.query.Room === room
//     console.log(Room)
//     res.send(Room)
// })
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})