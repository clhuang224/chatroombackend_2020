$(function() {
    var socket = io();
    let inputName = document.querySelector("#inputName");
    let username;
    let scrollPosition = 0;

    inputName.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13 && inputName.value.trim() != "") {
            username = inputName.value;
            document.querySelector(".cover").classList.add("none");
            socket.emit("connection", {
                username: username
            });
        }
    });

    socket.on("message", function(object) {
        if (object) {
            let messages = document.querySelector("#messages");
            switch (object.type) {
                case "chat":
                    messages.innerHTML += `<li>${object.username}：${object.message}</li>`;
                    scrollPosition += $("#messages")
                        .last()
                        .height();
                    $("#messages").animate({ scrollTop: scrollPosition }, 100);
                    break;
                case "connect":
                    messages.innerHTML = "";
                    for (let i = 0; i < object.data.length; i++) {
                        switch (object.data[i].type) {
                            case "chat":
                                messages.innerHTML += `<li>${object.data[i].username}：${object.data[i].message}</li>`;
                                break;
                            case "connect":
                                messages.innerHTML += `<li>${object.data[i].username} 加入聊天室</li>`;
                                break;
                            case "disconnect":
                                messages.innerHTML += `<li>${object.data[i].username} 離開聊天室</li>`;
                                break;
                        }
                        scrollPosition += $("#messages")
                            .last()
                            .height();
                        $("#messages").animate(
                            { scrollTop: scrollPosition },
                            100
                        );
                    }
                    messages.innerHTML += `<li>${object.username} 加入聊天室</li>`;
                    scrollPosition += $("#messages")
                        .last()
                        .height();
                    $("#messages").animate({ scrollTop: scrollPosition }, 100);
                    break;
                case "disconnect":
                    messages.innerHTML += `<li>${object.username} 離開聊天室</li>`;
                    scrollPosition += $("#messages")
                        .last()
                        .height();
                    $("#messages").animate({ scrollTop: scrollPosition }, 100);
                    break;
            }
        }
    });

    $("form").submit(function(e) {
        e.preventDefault(); // prevents page reloading
        if (
            $("#m")
                .val()
                .trim() !== ""
        ) {
            socket.emit("chat", {
                type: "chat",
                username: username,
                message: $("#m").val()
            });
            $("#m").val("");
            return false;
        }
    });
});
