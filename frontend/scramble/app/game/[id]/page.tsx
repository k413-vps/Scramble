"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { useParams } from "next/navigation";

import { GetGameResponse } from "shared/types/API";
import { ClientSideGame } from "shared/types/game";
import LoadingPage from "@/components/LoadingPage";
import { useEffect } from "react";

import GameNotFoundPage from "./GameNotFoundPage";
// import DebugPage from "./DebugPage";
import LobbyPage from "./LobbyPage";

import { useGameStore } from "@/utils/game/[id]/store";

import { io, Socket } from "socket.io-client";
import authClient from "@/lib/auth_client";
import { JoinToClient, JoinToServer, StartToClient } from "shared/types/SocketMessages";
import GamePage from "./GamePage";

let socket: Socket;

const page = "game";

export default function Page() {
    const params = useParams();
    const roomId = params.id;

    const gameStarted = useGameStore((state) => state.gameStarted);

    const players = useGameStore((state) => state.players);

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
        useGameStore.getState().addPlayer(msg.player);
        if (msg.owner) {
            useGameStore.getState().setOwner(msg.player.id);
        }
    };

    const handleStart = (msg: StartToClient) => {
        useGameStore.getState().startGame(msg.players, msg.hand, msg.tilesRemaining);
    };

    useEffect(() => {
        if (roomId && !authPending && !getGameLoading) {
            const userId = session?.user.id;
            socket = io(process.env.NEXT_PUBLIC_WS_URL, {
                path: process.env.NEXT_PUBLIC_WS_PATH,
                query: { roomId, page, userId },
                transports: ["websocket"],
            });

            const alreadyJoined = players.some((player) => player.id === userId);
            if (!alreadyJoined && session && session.user.name && session.user.image) {
                const socketMessage: JoinToServer = {
                    name: session.user.name,
                    profilePicture: session.user.image,
                };
                socket.emit("join_game", socketMessage);
            }

            socket.on("join_game", handleJoin);
            socket.on("start_game", handleStart);
        }

        return () => {
            if (socket && socket.active) {
                socket.disconnect();
            }
        };
    }, [roomId, authPending, data]);

    if (getGameLoading || authPending || !session?.user?.id || !socket) {
        return <LoadingPage />;
    }

    if (error) {
        return <GameNotFoundPage />;
    }

    if (gameStarted) {
        return (
                <GamePage />
        );
    }

    return <LobbyPage userId={session.user.id} socket={socket} />;
}
