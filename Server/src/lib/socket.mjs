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

io.on('connection', (socket) => {
    console.log('User Connected', socket.id);
    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

export { io, server, app };