"use client";

import { Button } from "@/components/ui/button";

import { Ping, RandomNumResponse } from "shared/types/API";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../lib/axios";
import { useParams } from "next/navigation";
import { MathForm } from "@/components/test/[id]/MathForm";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatInput from "@/components/test/[id]/ChatInput";
import ChatMsgs from "@/components/test/[id]/ChatMsgs";

async function getPing(): Promise<Ping> {
    const res = await api.get("/ping");
    return res.data;
}

async function getRandomNum(): Promise<RandomNumResponse> {
    const res = await api.get("/randomNum");
    return res.data;
}

var socket: Socket | null = null;
var userId = Math.random().toString(36).substring(2, 10); // random 8 char string for user

export default function Page() {
    const params = useParams();
    const roomId = params.id;

    const {
        data: ping,
        isLoading: pingIsLoading,
        error: pingError,
    } = useQuery({
        queryKey: ["ping"],
        queryFn: getPing,
    });

    const {
        data: randomNum,
        isLoading: randomNumIsLoading,
        error: randomNumError,
        refetch: randomNumRefetch,
        isFetching: randomNumIsFetching,
        isSuccess: randomNumIsSuccess,
    } = useQuery({
        queryKey: ["randomNum"],
        queryFn: getRandomNum,
        enabled: false,
    });

    const [mathResult, setMathResult] = useState(0);
    const [chatMsgs, setChatMsgs] = useState<string[]>([]);

    useEffect(() => {
        console.log(roomId, process.env.NEXT_PUBLIC_WS_URL, process.env.NEXT_PUBLIC_WS_PATH);
        if (roomId) {
            console.log("trying to connect");
            socket = io(process.env.NEXT_PUBLIC_WS_URL, {
                path: process.env.NEXT_PUBLIC_WS_PATH,
                query: { roomId, userId },
                transports: ["websocket"],
            });
        }

        return () => {
            if (socket && socket.active) {
                socket.disconnect();
            }

            console.log("disconnecting websocket");
        };
    }, [roomId]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1>Lobby #{roomId}</h1>
            <h2>This is a test page to test the connections between front and backend. Right now, it tests:</h2>
            <ul className="list-disc pl-4">
                <li>Getting lobby # from url</li>
                <li>Get request</li>
                <li>Post request without a body</li>
                <li>Post request with a body submitted via form</li>
                <li>web socket chat room, with broadcast by id and user ids</li>
            </ul>
            <h1>Ping: {ping?.message}</h1>
            <div className="flex flex-row items-center gap-4">
                <Button variant="default" disabled={randomNumIsFetching} onClick={() => randomNumRefetch()}>
                    Generate Number
                </Button>
                {randomNumIsSuccess && <h1>{randomNum?.num}</h1>}
            </div>
            <MathForm setMathResult={setMathResult}></MathForm>
            <h1>Result was {mathResult}</h1>

            {!socket ? (
                <h1>Cannot connect to socket {":("}</h1>
            ) : (
                <div>
                    <h1>SOCKET CONNECTED CHAT BELOW YOU ARE {userId}</h1>
                    <ChatMsgs socket={socket}></ChatMsgs>
                    <ChatInput socket={socket} />
                </div>
            )}
        </div>
    );
}
