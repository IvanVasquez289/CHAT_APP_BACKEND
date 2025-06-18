import { Server } from "socket.io";
import express from 'express';
import http from 'http';


const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

const connectedUsers: { [userId: string]: string } = {}; // {userId: socketId}
const messages = [] ;
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string
    // io.emit is used to send events to all connected users
    if (userId) {
        connectedUsers[userId] = socket.id;
        io.emit("getConnectedUsers", Object.keys(connectedUsers)); // ← esto actualiza a todos en tiempo real
    }

    socket.on("disconnect", () => {
        delete connectedUsers[userId]
        io.emit("getConnectedUsers", Object.keys(connectedUsers))
    })

   
})

export {app, server}