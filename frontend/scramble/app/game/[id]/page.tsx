"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { useParams } from "next/navigation";

import { GetGameResponse } from "shared/types/API";
import { ClientSideGame } from "shared/types/game";
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
    StartToClient,
} from "shared/types/SocketMessages";
import GamePage from "./GamePage";
import { ActionType, PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";

let socket: Socket;

const page = "game";

export default function Page() {
    const params = useParams();
    const roomId = params.id;

    const gameStarted = useGameStore((state) => state.gameStarted);

    const players = useGameStore((state) => state.players);

    const setPlayerId = useGameStore((state) => state.setPlayerId);

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
            useGameStore.getState().init(data);
        }
    }, [data]);

    const {
        data: session,
        isPending: authPending, //loading state
        // error: sessionError, //error object
        // refetch, //refetch the session
    } = authClient.useSession();

    const handleJoin = (msg: JoinToClient) => {
        useGameStore.getState().addPlayer(msg.player, msg.playerId);
        if (msg.owner) {
            useGameStore.getState().setOwner(msg.playerId);
        }
    };

    const handleStart = (msg: StartToClient) => {
        useGameStore.getState().startGame(msg.turnOrder, msg.hand, msg.bagSize);
    };

    const handlePlay = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as PlaceAction;

        useGameStore.getState().placeAction(actionData, msg.bagSize!, msg.nextPlayerId);
    };

    const handlePass = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as PassAction;
        useGameStore.getState().passAction(actionData, msg.nextPlayerId);
    };

    const handleShuffle = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as ShuffleAction;
        useGameStore.getState().shuffleAction(actionData, msg.bagSize!, msg.nextPlayerId);
    };

    const handleWrite = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as WriteAction;
        useGameStore.getState().writeAction(actionData, msg.nextPlayerId);
    };

    const handleSacrifice = (msg: ActionToClient) => {
        const actionData = msg.historyElement.actionData as SacrificeAction;
        useGameStore.getState().sacrificeAction(actionData, msg.nextPlayerId);
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
    };

    const handleDrawTiles = (msg: DrawTilesToClient) => {
        useGameStore.getState().drawTiles(msg.newHand, msg.bagSize);
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
        !socketConnected
    );

    if (getGameLoading || authPending || !session?.user?.id || !socketConnected) {
        return <LoadingPage />;
    }

    if (error) {
        return <GameNotFoundPage />;
    }

    if (gameStarted) {
        const userId = session?.user.id;

        const alreadyJoined = userId in players;
        console.log("alreadyJoined", alreadyJoined);
        console.log("players", players);
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
    }

    return <LobbyPage userId={session.user.id} socket={socket} />;
}
