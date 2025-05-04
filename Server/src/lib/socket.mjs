import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL ],
  },
});

const userSocketMap = {};

export function getReceiverSocketID(receiverID) {
  return userSocketMap[receiverID];
}

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  const userID = socket.handshake.query.userID;

  if (!userID) {
    console.log("⚠️ Missing userID in handshake.");
    return;
  }

  userSocketMap[userID] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
