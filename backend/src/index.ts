import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const cors = require("cors");

import dotenv from "dotenv";

import { MathRequest, MathResponse, Ping, RandomNumResponse } from "shared/types/API";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.get("/api/ping", (_, res) => {
    console.log("pinged");

    var result: Ping = {
        message: "/ping works",
    };
    res.send(result);
});

app.get("/api/randomNum", async (_, res) => {
    var result: RandomNumResponse = {
        num: Math.floor(Math.random() * 1000),
    };

    await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
    res.send(result);
});

app.post("/api/math", async (req, res) => {
    var request: MathRequest = req.body;

    var result: MathResponse = {
        num: request.num1 * request.num2,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
    res.send(result);
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("message", "Hello from server");

    socket.on("message", (msg) => {
        console.log(`Client says: ${msg}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
