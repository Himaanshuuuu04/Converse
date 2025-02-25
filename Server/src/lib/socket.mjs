import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_KEY],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('User Connected', socket.id);

    const userID = socket.handshake.query.userID;
    userSocketMap[userID] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
        delete userSocketMap[userID];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { io, server, app };