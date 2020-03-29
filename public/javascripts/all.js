$(function() {
  let inputName = document.querySelector("#inputName");
  let userName;
  inputName.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13 && inputName.value.trim() != "") {
      userName = inputName.value;
      document.querySelector(".cover").classList.add("none");
      socket.emit("connect", {
        userName: userName
      });
    }
  });

  var socket = io();
  socket.on("connect", function(object) {
    if (object) {
      document.querySelector(
        "#messages"
      ).innerHTML += `<li>${object.userName} 加入聊天室。</li>`;
    }
  });
  socket.on("chat message", function(object) {
    if (object) {
      document.querySelector(
        "#messages"
      ).innerHTML += `<li>${object.userName}：${object.message}</li>`;
    }
  });
  socket.on("disconnect", function(object) {
    if (object.userName) {
      document.querySelector(
        "#messages"
      ).innerHTML += `<li>${object.userName} 離開聊天室。</li>`;
    }
  });

  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", {
      userName: userName,
      message: $("#m").val()
    });
    $("#m").val("");
    return false;
  });
});
