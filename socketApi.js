let socket_io = require("socket.io");
let io = socket_io();
let socketApi = {};
let db = require("./db");

socketApi.io = io;

io.on("connection", function(socket) {
    let data = [];
    let username;

    socket.on("connection", function(object) {
        console.log(`${object.username} connected`);
        db.connection.query(
            `SELECT * FROM ${process.env["DB_DATABASE"]}.message;`,
            (err, rows, fields) => {
                if (err) throw err;
                data = rows.concat(data);
                username = object.username;
                db.connection.query(
                    `INSERT INTO ${process.env["DB_DATABASE"]}.message (username,type) values ('${username}','connect');`,
                    (err, rows, fields) => {
                        if (err) throw err;
                    }
                );
                io.emit("message", {
                    type: "connect",
                    username: username,
                    data: data
                });
            }
        );
    });

    socket.on("chat", function(object) {
        data.push(object);
        db.connection.query(
            `INSERT INTO ${process.env["DB_DATABASE"]}.message (username,message) values ('${object.username}','${object.message}');`,
            (err, rows, fields) => {
                if (err) throw err;
            }
        );
        io.emit("message", object);
        console.log(`${object.username} : ${object.message}`);
    });

    socket.on("disconnect", function() {
        console.log(`${username} disconnected`);
        io.emit("message", {
            type: "disconnect",
            username: username
        });
    });
});

socketApi.sendNotification = function() {
    io.sockets.emit("hello", { msg: "Hello World!" });
};

module.exports = socketApi;
