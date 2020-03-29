let socket_io = require("socket.io");
let io = socket_io();
let socketApi = {};

socketApi.io = io;

io.on("connection", function(socket) {
  let userName = "";
  socket.on("connect", function(object) {
    io.emit("connect", object);
    console.log(`${object.userName} connected`);
    userName = object.userName;
  });

  socket.on("chat message", function(object) {
    io.emit("chat message", object);
    console.log(`${object.userName} : ${object.message}`);
  });
  socket.on("disconnect", function() {
    console.log(`${userName} disconnected`);
    io.emit("disconnect", {
      userName: userName
    });
  });
});

socketApi.sendNotification = function() {
  io.sockets.emit("hello", { msg: "Hello World!" });
};

module.exports = socketApi;
