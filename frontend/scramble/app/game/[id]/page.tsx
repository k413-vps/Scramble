"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { useParams } from "next/navigation";

import { GetGameResponse } from "shared/types/API";
import { ClientSideGame, GameState } from "shared/types/game";
import LoadingPage from "@/components/LoadingPage";
import { useEffect, useState } from "react";

import GameNotFoundPage from "./GameNotFoundPage";
// import DebugPage from "./DebugPage";
import LobbyPage from "./LobbyPage";

import { useGameStore } from "@/utils/game/[id]/store";

import { io, Socket } from "socket.io-client";
import authClient from "@/lib/auth_client";
import {
    ActionToClient,
    DrawTilesToClient,
    JoinToClient,
    JoinToServer,
    LastDrawToClient,
    StartToClient,
    GameOverToClient,
    PlannedToClient,
} from "shared/types/SocketMessages";
import GamePage from "./GamePage";
import { ActionType, PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";
import CompletedPage from "./CompletedPage";

let socket: Socket;

const page = "game";

export default function Page() {
    const params = useParams();
    const roomId = params.id;

    const gameState = useGameStore((state) => state.gameState);

    const players = useGameStore((state) => state.players);

    const init = useGameStore((state) => state.init);
    const addPlayer = useGameStore((state) => state.addPlayer);
    const startGame = useGameStore((state) => state.startGame);
    const placeAction = useGameStore((state) => state.placeAction);
    const passAction = useGameStore((state) => state.passAction);
    const shuffleAction = useGameStore((state) => state.shuffleAction);
    const writeAction = useGameStore((state) => state.writeAction);
    const sacrificeAction = useGameStore((state) => state.sacrificeAction);

    const drawTiles = useGameStore((state) => state.drawTiles);

    const setPlayerId = useGameStore((state) => state.setPlayerId);
    const setTimeOfLastTurn = useGameStore((state) => state.setTimeOfLastTurn);
    const setLastToDrawId = useGameStore((state) => state.setLastToDrawId);
    const gameOver = useGameStore((state) => state.gameOver);
    const setPlannedTiles = useGameStore((state) => state.setPlannedTiles);

    const [socketConnected, setSocketConnected] = useState(false);

    async function fetchState(): Promise<ClientSideGame | null> {
        const res = (await api.get(`${process.env.NEXT_PUBLIC_BACKEND_AUTH_PATH}/game/${roomId}`))
            .data as GetGameResponse;

        return res.game;
    }

    const {
        data,
        isLoading: getGameLoading,
        error,
    } = useQuery({
        queryKey: ["game"],
        queryFn: fetchState,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
        staleTime: Infinity, // treat data as always fresh
    });

    useEffect(() => {
        if (data) {
            init(data);
        }
    }, [data]);

    const {
        data: session,
        isPending: authPending, //loading state
        // error: sessionError, //error object
        // refetch, //refetch the session
    } = authClient.useSession();

    const handleJoin = (msg: JoinToClient) => {
        addPlayer(msg.player, msg.playerId, msg.playerTurnOrder, msg.owner, msg.bagSize);
    };

    const handleStart = (msg: StartToClient) => {
        startGame(msg.turnOrder, msg.hand, msg.bagSize, msg.timeOfLastTurn);
    };

    const handlePlay = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as PlaceAction;

        console.log("handle play action id to points", actionData.idToPoints);
        placeAction(actionData, msg.bagSize!, actionData.idToPoints, msg.nextPlayerId);
    };

    const handlePass = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as PassAction;
        passAction(actionData, msg.nextPlayerId);
    };

    const handleShuffle = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as ShuffleAction;
        shuffleAction(actionData, msg.bagSize!, msg.nextPlayerId);
    };

    const handleWrite = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as WriteAction;
        writeAction(actionData, msg.nextPlayerId);
    };

    const handleSacrifice = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as SacrificeAction;
        sacrificeAction(actionData, msg.nextPlayerId);
    };

    const handleAction = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData;

        switch (actionData.type) {
            case ActionType.PLAY:
                handlePlay(msg);
                break;
            case ActionType.PASS:
                handlePass(msg);
                break;
            case ActionType.SHUFFLE:
                handleShuffle(msg);
                break;
            case ActionType.WRITE:
                handleWrite(msg);
                break;
            case ActionType.SACRIFICE:
                handleSacrifice(msg);
                break;
        }

        setPlannedTiles([]);
        setTimeOfLastTurn(msg.timeOfLastTurn);
    };

    const handleLastDraw = (msg: LastDrawToClient) => {
        console.log("last draw msg", msg, msg.lastToDrawId);
        setLastToDrawId(msg.lastToDrawId);
    };

    const handleDrawTiles = (msg: DrawTilesToClient) => {
        drawTiles(msg.newHand, msg.bagSize);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleGameOver = (msg: GameOverToClient) => {
        gameOver();
        console.log("game over received");
    };

    const handlePlannedTiles = (msg: PlannedToClient) => {
        console.log("planned tiles msg", msg);
        setPlannedTiles(msg.plannedTiles);
    };

    useEffect(() => {
        if (roomId && !authPending && !getGameLoading) {
            const userId = session?.user.id;

            socket = io(process.env.NEXT_PUBLIC_WS_URL, {
                path: process.env.NEXT_PUBLIC_WS_PATH,
                query: { roomId, page, userId },
                transports: ["websocket"],
            });

            const alreadyJoined = userId! in players;

            if (!alreadyJoined && session && session.user.name && session.user.image) {
                const socketMessage: JoinToServer = {
                    name: session.user.name,
                    profilePicture: session.user.image,
                };
                socket.emit("join_game", socketMessage);
            }

            socket.on("connect", () => setSocketConnected(true));

            socket.on("join_game", handleJoin);
            socket.on("start_game", handleStart);
            socket.on("action", handleAction);
            socket.on("draw_tiles", handleDrawTiles);
            socket.on("last_draw", handleLastDraw);
            socket.on("game_over", handleGameOver);
            socket.on("planned_tiles", handlePlannedTiles);

            setPlayerId(session!.user.id);
        } else if (!authPending) {
            setPlayerId(session!.user.id);
        }

        return () => {
            if (socket && socket.active) {
                socket.disconnect();
            }
        };
    }, [roomId, authPending, data]);

    console.log(
        "loading check",
        "getGameLoading",
        getGameLoading,
        "authPending",
        authPending,
        "!session?.user?.id",
        !session?.user?.id,
        "!socket",
        !socket,
        "socket",
        socket,
        "socket?.active",
        socket?.active,
        "!socketConnected",
        !socketConnected,
        "gameState",
        gameState
    );

    if (getGameLoading || authPending || !session?.user?.id || !socketConnected) {
        return <LoadingPage />;
    }

    if (error) {
        return <GameNotFoundPage />;
    }

    if (gameState === GameState.IN_PROGRESS) {
        const userId = session?.user.id;

        const alreadyJoined = userId in players;

        if (!alreadyJoined) {
            return <LoadingPage />;
        }

        if (!alreadyJoined && session && session.user.name && session.user.image) {
            const socketMessage: JoinToServer = {
                name: session.user.name,
                profilePicture: session.user.image,
            };
            socket.emit("join_game", socketMessage);
        }
        return <GamePage socket={socket} />;
    } else if (gameState === GameState.LOBBY) {
        return <LobbyPage userId={session.user.id} socket={socket} />;
    } else if (gameState === GameState.COMPLETED) {
        return <CompletedPage />;
    }

    return <div>how the fuck are you reading this </div>;
}
