const test = require('./queryy.js');
const query = require('./query.js')
const express = require('express')
const axios = require('axios');
const createError = require('http-errors');
const app = express()
const port = 3000
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/send_message', function (req, res) {
    arr = []
    const mess = req.body.message
    const username = req.body.username
    const friendname = req.body.friendname
    arr.push(username)
    arr.push(friendname)
    arr.sort()
    room = arr[0].toLowerCase() + arr[1].toLowerCase()
    query.save_mess(room, username, mess)
    res.send(mess)
})

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
    data = []
    for (const obj of friends) {
        data.push(obj.room);
    }
    res.send(data)
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})