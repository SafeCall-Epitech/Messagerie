const query = require('./query.js');
const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/conv/:username/:friendname', function (req, res) {
    arr = []
    arr.push(req.params.username)
    arr.push(req.params.friendname)
    arr.sort()
    room = arr[0].toLowerCase() + '_' + arr[1].toLowerCase()
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

// Serv get message send by an user and save it in Database 

app.post('/send_message', function (req, res) {
    arr = []
    const mess = req.body.message
    const username = req.body.username
    const friendname = req.body.friendname
    arr.push(username)
    arr.push(friendname)
    arr.sort()
    room = arr[0].toLowerCase() + '_' + arr[1].toLowerCase()
    query.save_mess(room, username, mess)
    res.send(mess)
})

//Serv send all the conversations already started by the user and send it to API

app.get('/get_all_conv/:username', function (req, res) {
    console.log(req.params.username)
    query.get_friends(req.params.username, function (dt, err) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            console.log(dt)
            res.send(dt)

        }

    });
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})