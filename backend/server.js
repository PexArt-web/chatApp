require("dotenv").config()
const { log } = console
const express = require('express');
const app   = express();
const port = process.env.PORT || 4000
const server = app.listen(port, ()=> log("chat server launched at port " + port) );

const io =  require('socket.io')(server);

app.use(express.static("public"))

// 

let socketConnected = new Set()

io.on("connection", onConnect)

function onConnect(socket) {
    log(socket.id)
    io.emit("clients-total", socketConnected.size)
    socketConnected.add(socket.id)

    socket.on("disconnect",()=>{
        log("disconnected", socket.id)
        socketConnected.delete(socket.id)
    })

    socket.on("message", (data)=>{
        socket.broadcast.emit("message", data)
        log("received message", data)
    })

    socket.on("publicFeedback", (data) =>{
        log(data, "received public feedback")
        socket.broadcast.emit("feedBack", data)
    })
}