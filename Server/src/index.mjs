import express from "express";
import authRouter from "./routes/auth.route.mjs";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRouter from "./routes/message.route.mjs";
import { app, server } from "./lib/socket.mjs";
import path from "path";
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client", "dist", "index.html"));
  });
}
app.use("/auth", authRouter);
app.use("/message", messageRouter);

server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
