var mysql = require('mysql');

function connection(user) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "mess"
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "CREATE TABLE if not exists " + user + "(id INT AUTO_INCREMENT primary key NOT NULL , username VARCHAR(255) , text VARCHAR(255) , room VARCHAR(255))";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        con.end(function (err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
    });

}

function save_mess(table, user, mess) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "mess"
    });


    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO " + table + " (username, text , room) VALUES ('" + user + "', '" + mess + "','" + table + "')";

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("message send")
        });
        con.end(function (err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
    });

}

function get_conv(table, cb) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "mess"
    });


    con.connect(function (err) {
        if (err) throw err;
        var sql = "select * from " + table;
        con.query(sql, function (err, result) {
            if (err) return cb([]);
            res = JSON.parse(JSON.stringify(result))
            return cb(res)
        });

        con.end(function (err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
    });

}

function get_friends(user, cb) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "mess"
    });


    con.connect(function (err) {
        if (err) throw err;
        var sql = "SELECT table_name from information_schema.tables where table_name like '%" + user + "%'"
        con.query(sql, function (err, result) {
            if (err) return cb([]);
            res = JSON.parse(JSON.stringify(result))
            return cb(res)
        });

        con.end(function (err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
    });


}
module.exports = { connection, save_mess, get_conv, get_friends }