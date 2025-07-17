import express from "express";
import http from "http";
import { Server } from "socket.io";
const cors = require("cors");

import dotenv from "dotenv";

import { MathRequest, MathResponse, Ping, RandomNumResponse } from "shared/types/API";
import { TestMessageToServer, TestMessageToClient } from "shared/types/SocketMessages";

dotenv.config();

const PORT = process.env.PORT;
const API_PATH = process.env.API_PATH;
const WS_PATH = process.env.WS_PATH;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get(`${API_PATH}/ping`, (_, res) => {
    console.log("pinged");

    var result: Ping = {
        message: "/ping works",
    };
    res.send(result);
});

app.get(`${API_PATH}/randomNum`, async (_, res) => {
    var result: RandomNumResponse = {
        num: Math.floor(Math.random() * 1000),
    };

    await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
    res.send(result);
});

app.post(`${API_PATH}/math`, async (req, res) => {
    var request: MathRequest = req.body;

    var result: MathResponse = {
        num: request.num1 * request.num2,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
    res.send(result);
});

const io = new Server(httpServer, {
    path: WS_PATH ?? "/ws",
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    var roomId = socket.handshake.query.roomId as string;
    var userId = socket.handshake.query.userId as string;

    socket.join(roomId);

    console.log(`User ${userId} connected to ${roomId}`);

    socket.emit("message", "Hello from server");

    socket.on("msg_to_server", (msg: TestMessageToServer) => {
        console.log(`Client says: ${msg.message}`);

        var res: TestMessageToClient = {
            message: msg.message,
            userId: userId,
        };
        io.to(roomId).emit("msg_to_client", res);
    });

    socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
