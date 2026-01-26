import express, { Request } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import dotenv from "dotenv";
import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./db/drizzle";

import { auth } from "./auth";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

import {
    ChatMsgsRequest,
    MathRequest,
    MathResponse,
    PingResponse,
    RandomNumResponse,
    RedisConnectedResponse,
    ChatMsgsResponse,
    ErrorResponse,
    CreateGameRequest,
    CreateGameResponse,
    GetGameRequest,
    GetGameResponse,
} from "shared/types/API";

import {
    TestMessageToServer,
    TestMessageToClient,
    JoinToClient,
    JoinToServer,
    StartToClient,
    StartToServer,
    ActionToServer,
    ActionToClient,
    DrawTilesToClient,
    LastDrawToClient,
    GameOverToClient,
    PlannedToClient,
} from "shared/types/SocketMessages";

import {
    createRoom,
    getRoom,
    RedisSetup,
    checkPlayerExists,
    addPlayer,
    setOwner,
    startGame,
    getCurrentPlayerId,
    getLastToDrawId,
    gameOver,
    getGameState,
    drawTilesRedis,
    setPlannedTiles,
} from "./util/RedisHelper";
import { parseCreateGameRequest } from "./util/APIParse";
import {
    ServerSideGame,
    ServerSidePlayer,
    ClientSidePlayer,
    ActionHistory,
    HistoryType,
    GameState,
} from "shared/types/game";
import { convertGame, convertPlayer } from "./util/ServerClientTranslation";
import { ActionType, PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";
import { handlePass, handlePlay, handleSacrifice, handleShuffle, handleWrite } from "./util/HandleActions";

import AsyncLock from "async-lock";

async function main() {
    const env = process.argv[2] || "dev";
    const envFile = `.env.${env}`;

    dotenv.config({ path: path.resolve(process.cwd(), envFile) });

    const API_PATH = process.env.API_PATH;
    const PROTECTED_PATH = process.env.PROTECTED_PATH!;

    const WS_PATH = process.env.WS_PATH;
    const FRONTEND_URL = process.env.FRONTEND_URL;

    const REDIS_IP = process.env.REDIS_IP;
    const REDIS_PWD = process.env.REDIS_PASSWORD;
    const REDIS_PORT = process.env.REDIS_PORT;
    const PORT = process.env.BACKEND_PORT;

    const app = express();
    const httpServer = http.createServer(app);
    const lock = new AsyncLock();

    app.use(
        cors({
            origin: FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true,
        })
    );

    app.all("/api/auth/*splat", toNodeHandler(auth));

    app.use(express.json());

    app.use(PROTECTED_PATH, async (req, res, next) => {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (session == null) {
            const err: ErrorResponse = {
                errMsg: "Unauthorized",
            };

            res.status(401).send(err);
            return;
        }

        next();
    });

    const redisUrl = `redis://default:${REDIS_PWD}@${REDIS_IP}:${REDIS_PORT}`;

    let { redisClient, success: redisConnected } = RedisSetup(redisUrl);

    // await migrate(db, { migrationsFolder: "drizzle" });

    app.get(`${PROTECTED_PATH}/ping`, async (req, res) => {
        const result: PingResponse = {
            message: "/auth ping works",
        };

        console.log("auth pinged");
        res.send(result);
    });

    app.post(`${PROTECTED_PATH}/create`, async (req: Request<CreateGameRequest>, res) => {
        const game = parseCreateGameRequest(req.body);
        const roomId = await createRoom(redisClient, game);

        const result: CreateGameResponse = {
            roomId,
        };

        res.send(result);
    });

    app.get(`${PROTECTED_PATH}/game/:roomId`, async (req: Request<GetGameRequest>, res) => {
        const roomId = req.params.roomId;

        const serverGame: ServerSideGame | null = await getRoom(roomId, redisClient);

        if (!serverGame) {
            const err: ErrorResponse = {
                errMsg: "Room not found",
            };

            res.status(404).send(err);
            return;
        }
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        const clientGame = convertGame(serverGame, session!.user.id);

        const result: GetGameResponse = {
            game: clientGame,
        };

        res.send(result);
    });

    app.get(`${API_PATH}/ping`, async (req, res) => {
        const result: PingResponse = {
            message: "/ping works",
        };

        console.log("pinged");
        res.send(result);
    });

    app.get(`${API_PATH}/redis`, (_, res) => {
        const result: RedisConnectedResponse = {
            connected: redisConnected,
        };

        res.send(result);
    });

    app.get(`${API_PATH}/randomNum`, async (_, res) => {
        const result: RandomNumResponse = {
            num: Math.floor(Math.random() * 1000),
        };

        await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
        res.send(result);
    });

    app.post(`${API_PATH}/math`, async (req, res) => {
        const request: MathRequest = req.body;

        const result: MathResponse = {
            num: request.num1 * request.num2,
        };

        await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
        res.send(result);
    });

    app.post(`${API_PATH}/math`, async (req, res) => {
        const request: MathRequest = req.body;

        const result: MathResponse = {
            num: request.num1 * request.num2,
        };

        await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 2 seconds, simulate latency
        res.send(result);
    });

    app.get(`${API_PATH}/chat_msgs/:roomId`, async (req: Request<ChatMsgsRequest>, res) => {
        const roomId = req.params.roomId;

        const messages = (await redisClient.json.get("test_chat", {
            path: `$.${roomId}`,
        })) as unknown as TestMessageToClient[][];

        const result: ChatMsgsResponse = {
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
        const roomId = socket.handshake.query.roomId as string;
        const userId = socket.handshake.query.userId as string;
        const page = socket.handshake.query.page as string;

        if (page == "test_chat") {
            redisClient.json.set("test_chat", `$.${roomId}`, [], {
                NX: true,
            });
        } // a shame that i did it this way

        const uniqueId = `${roomId}:${page}`;
        socket.join(uniqueId);

        console.log(`User ${userId} connected to ${roomId} in page ${page}`);

        socket.emit("message", "Hello from server");

        socket.on("test_chat_msg_to_server", (msg: TestMessageToServer) => {
            const res: TestMessageToClient = {
                message: msg.message,
                username: msg.username,
            };

            redisClient.json.arrAppend("test_chat", `$.${roomId}`, res as any);

            io.to(uniqueId).emit("test_chat_msg_to_client", res);
        });

        socket.on("join_game", async (msg: JoinToServer) => {
            const playerExists = await checkPlayerExists(redisClient, userId, roomId);
            if (playerExists) {
                return;
            }

            const serverPlayer: ServerSidePlayer = {
                profilePicture: msg.profilePicture,
                name: msg.name,
                hand: [],
                points: 0,
                mana: 0,
                purchasedSpells: [],
            };

            const playerTurnOrder = await addPlayer(redisClient, serverPlayer, userId, roomId);
            const size = playerTurnOrder.length;

            const clientPlayer: ClientSidePlayer = convertPlayer(serverPlayer);

            if (size === 1) {
                await setOwner(redisClient, userId, roomId);
            }

            const gameState = await getGameState(roomId, redisClient);
            if (gameState === GameState.IN_PROGRESS) {
                const drawResponse = await drawTilesRedis(redisClient, roomId, userId, serverPlayer.hand);
                const res: JoinToClient = {
                    player: clientPlayer,
                    owner: size === 1,
                    playerId: userId,
                    playerTurnOrder,
                    bagSize: drawResponse.bagSize,
                };

                const newTilesRes: DrawTilesToClient = {
                    newHand: drawResponse.newHand,
                    bagSize: drawResponse.bagSize,
                };

                io.to(uniqueId).emit("join_game", res);
                socket.emit("draw_tiles", newTilesRes);
            } else {
                const res: JoinToClient = {
                    player: clientPlayer,
                    owner: size === 1,
                    playerId: userId,
                    playerTurnOrder,
                };
                io.to(uniqueId).emit("join_game", res);
            }
        });

        socket.on("start_game", async (msg: StartToServer) => {
            const { players, playerOrder, bagSize, timeOfLastTurn } = await startGame(redisClient, roomId);

            const socketsInRoom = await io.in(uniqueId).fetchSockets();

            for (const socketInstance of socketsInRoom) {
                const socketInstanceUserId = socketInstance.handshake.query.userId as string;

                const playerHand = players[socketInstanceUserId]!.hand;

                const res: StartToClient = {
                    turnOrder: playerOrder,
                    hand: playerHand,
                    bagSize,
                    timeOfLastTurn,
                };
                socketInstance.emit("start_game", res);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected`);
        });

        socket.on("action", async (msg: ActionToServer) => {
            const actionData = msg.actionData;
            const lockKey = `lock:${roomId}:action`;

            await lock.acquire(lockKey, async () => {
                const currentPlayer = await getCurrentPlayerId(roomId, redisClient);
                if (currentPlayer !== actionData.playerId) {
                    console.log("Not this player's turn");
                    console.log(`User: ${userId}, action player: ${actionData.playerId}`);
                    return;
                }
                let bagEmptied = false;

                await setPlannedTiles(redisClient, roomId, []); // clear planned tiles on any action

                switch (actionData.type) {
                    case ActionType.PLAY:
                        const { newHand, bagSize, nextPlayerId, timeOfLastTurn, emptiedBag } = await handlePlay(
                            actionData as PlaceAction,
                            roomId,
                            redisClient
                        );

                        bagEmptied = emptiedBag;

                        // can't leak info about other players' hands!!
                        const placedTiles = (actionData as PlaceAction).hand.filter((t) => t.placed);

                        const newActionData: PlaceAction = {
                            type: ActionType.PLAY,
                            hand: placedTiles,
                            playerId: actionData.playerId,
                            points: actionData.points,
                            mana: actionData.mana,
                            wordsFormed: (actionData as PlaceAction).wordsFormed,
                            idToPoints: (actionData as PlaceAction).idToPoints,
                        };

                        const historyElementPlay: ActionHistory = {
                            type: HistoryType.ACTION,
                            actionData: newActionData,
                        };

                        const res: ActionToClient = {
                            historyElement: historyElementPlay,
                            bagSize,
                            nextPlayerId,
                            timeOfLastTurn,
                            emptiedBag,
                        };

                        io.to(uniqueId).emit("action", res);

                        if (emptiedBag) {
                            const lastDrawMsg: LastDrawToClient = {
                                lastToDrawId: actionData.playerId,
                            };
                            io.to(uniqueId).emit("last_draw", lastDrawMsg);
                        }

                        const newTilesRes: DrawTilesToClient = {
                            newHand,
                            bagSize,
                        };

                        socket.emit("draw_tiles", newTilesRes);

                        break;
                    case ActionType.PASS:
                        const { nextPlayerId: nextPlayerIdPass, timeOfLastTurn: timeOfLastTurnPass } = await handlePass(
                            actionData as PassAction,
                            roomId,
                            redisClient
                        );

                        const historyElementPass: ActionHistory = {
                            type: HistoryType.ACTION,
                            actionData: actionData,
                        };

                        const resPass: ActionToClient = {
                            historyElement: historyElementPass,
                            nextPlayerId: nextPlayerIdPass,
                            timeOfLastTurn: timeOfLastTurnPass,
                            emptiedBag: false,
                        };

                        io.to(uniqueId).emit("action", resPass);

                        break;
                    case ActionType.SHUFFLE:
                        const {
                            newHand: newHandShuffle,
                            bagSize: bagSizeShuffle,
                            nextPlayerId: nextPlayerIdShuffle,
                            timeOfLastTurn: timeOfLastTurnShuffle,
                            emptiedBag: emptiedBagShuffle,
                        } = await handleShuffle(actionData as ShuffleAction, roomId, redisClient);

                        bagEmptied = emptiedBagShuffle;

                        const historyElementShuffle: ActionHistory = {
                            type: HistoryType.ACTION,
                            actionData: actionData,
                        };

                        const resShuffle: ActionToClient = {
                            historyElement: historyElementShuffle,
                            bagSize: bagSizeShuffle,
                            nextPlayerId: nextPlayerIdShuffle,
                            timeOfLastTurn: timeOfLastTurnShuffle,
                            emptiedBag: emptiedBagShuffle,
                        };

                        io.to(uniqueId).emit("action", resShuffle);

                        if (emptiedBagShuffle) {
                            const lastDrawMsg: LastDrawToClient = {
                                lastToDrawId: actionData.playerId,
                            };
                            io.to(uniqueId).emit("last_draw", lastDrawMsg);
                        }

                        const newTilesResShuffle: DrawTilesToClient = {
                            newHand: newHandShuffle,
                            bagSize: bagSizeShuffle,
                        };

                        socket.emit("draw_tiles", newTilesResShuffle);

                        break;
                    case ActionType.WRITE:
                        handleWrite(actionData as WriteAction, roomId, redisClient);
                        break;
                    case ActionType.SACRIFICE:
                        const { nextPlayerId: nextPlayerIdSacrifice, timeOfLastTurn: timeOfLastTurnSacrifice } =
                            await handleSacrifice(actionData as SacrificeAction, roomId, redisClient);

                        const historyElementSacrifice: ActionHistory = {
                            type: HistoryType.ACTION,
                            actionData: actionData,
                        };

                        const resSacrifice: ActionToClient = {
                            historyElement: historyElementSacrifice,
                            nextPlayerId: nextPlayerIdSacrifice,
                            timeOfLastTurn: timeOfLastTurnSacrifice,
                            emptiedBag: false,
                        };
                        io.to(uniqueId).emit("action", resSacrifice);

                        break;
                    default:
                        console.error(`Unknown action type: ${actionData.type}`);
                }

                const lastToDrawId = await getLastToDrawId(roomId, redisClient);
                if (!bagEmptied && lastToDrawId === actionData.playerId) {
                    const gameOverMsg: GameOverToClient = {};
                    await gameOver(roomId, redisClient);
                    io.to(uniqueId).emit("game_over", gameOverMsg);
                }
            });
        });

        socket.on("planned_tiles", async (msg: PlannedToClient) => {
            const positions = msg.plannedTiles;

            await setPlannedTiles(redisClient, roomId, positions);
            socket.to(uniqueId).emit("planned_tiles", msg);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}

main(); // i need top level await so bad man
