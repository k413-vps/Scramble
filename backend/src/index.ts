import express, { Request } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import dotenv from "dotenv";
import path from "path";

import {
    ChatMsgsRequest,
    MathRequest,
    MathResponse,
    PingResponse,
    RandomNumResponse,
    RedisConnectedResponse,
    ChatMsgsResponse,
} from "shared/types/API";

import { TestMessageToServer, TestMessageToClient } from "shared/types/SocketMessages";

import { createClient, RedisClientType } from "redis";

const env = process.argv[2] || "dev";
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const API_PATH = process.env.API_PATH;
const WS_PATH = process.env.WS_PATH;
const FRONTEND_URL = process.env.FRONTEND_URL;

const REDIS_IP = process.env.REDIS_IP;
const REDIS_PWD = process.env.REDIS_PASSWORD;
const REDIS_PORT = process.env.REDIS_PORT;
const PORT = process.env.BACKEND_PORT;

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

const redisUrl = `redis://default:${REDIS_PWD}@${REDIS_IP}:${REDIS_PORT}`;

let redisClient: RedisClientType;
let redisConnected: boolean;

try {
    redisClient = createClient({
        url: redisUrl,
    });

    redisClient.connect();

    redisConnected = true;
    console.log("connected to redis");

    redisClient.json.set(
        "test_chat",
        "$",
        {},
        {
            NX: true,
        }
    ); // create empty dictionary, if it doesn't exist already
} catch (err) {
    redisConnected = false;
    console.log("can't connect to redis :/");
}

app.get(`${API_PATH}/ping`, (_, res) => {
    var result: PingResponse = {
        message: "/ping works",
    };
    console.log("pinged");
    res.send(result);
});

app.get(`${API_PATH}/redis`, (_, res) => {
    var result: RedisConnectedResponse = {
        connected: redisConnected,
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

app.post(`${API_PATH}/math`, async (req, res) => {
    var request: MathRequest = req.body;

    var result: MathResponse = {
        num: request.num1 * request.num2,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
    res.send(result);
});

app.get(`${API_PATH}/chat_msgs/:roomId`, async (req: Request<ChatMsgsRequest>, res) => {
    // var request: ChatMsgsRequest = req.body;
    const roomId = req.params.roomId;

    var messages = (await redisClient.json.get("test_chat", {
        path: `$.${roomId}`,
    })) as unknown as TestMessageToClient[][];

    var result: ChatMsgsResponse = {
        messages: messages[0],
    };

    res.send(result);
});

const io = new Server(httpServer, {
    path: WS_PATH ?? "/ws",
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
    },
});

io.on("connection", async (socket) => {
    var roomId = socket.handshake.query.roomId as string;
    var userId = socket.handshake.query.userId as string;
    var page = socket.handshake.query.page as string;

    if (page == "test_chat") {
        redisClient.json.set("test_chat", `$.${roomId}`, [], {
            NX: true,
        });
    }

    socket.join(roomId);

    console.log(`User ${userId} connected to ${roomId} in page ${page}`);

    socket.emit("message", "Hello from server");

    socket.on("test_chat_msg_to_server", (msg: TestMessageToServer) => {
        var res: TestMessageToClient = {
            message: msg.message,
            userId: userId,
        };

        redisClient.json.arrAppend("test_chat", `$.${roomId}`, res as any);

        io.to(roomId).emit("test_chat_msg_to_client", res);
    });

    socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
