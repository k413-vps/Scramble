"use client";

import { Button } from "@/components/ui/button";

import { PingResponse, RandomNumResponse, RedisConnectedResponse } from "shared/types/API";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../lib/axios";
import { useParams } from "next/navigation";
import { MathForm } from "@/components/test/[id]/MathForm";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatInput from "@/components/test/[id]/ChatInput";
import ChatMsgs from "@/components/test/[id]/ChatMsgs";

async function getPing(): Promise<PingResponse> {
    const res = await api.get("/ping");
    return res.data;
}

async function getRedisConnection(): Promise<RedisConnectedResponse> {
    const res = await api.get("/redis");
    console.log("redis", await res.data);
    return res.data;
}

async function getRandomNum(): Promise<RandomNumResponse> {
    const res = await api.get("/randomNum");
    return res.data;
}

var socket: Socket | null = null;
var userId = Math.random().toString(36).substring(2, 10); // random 8 char string for user
var page = "test_chat";

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
        retry: 0,
    });

    const { data: redisConnected } = useQuery({
        queryKey: ["redisConnected"],
        queryFn: getRedisConnection,
        retry: 0,
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

    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        if (roomId) {
            console.log("trying to connect");
            socket = io(process.env.NEXT_PUBLIC_WS_URL, {
                path: process.env.NEXT_PUBLIC_WS_PATH,
                query: { roomId, userId, page },
                transports: ["websocket"],
            });

            socket.on("connect", () => {
                setSocketConnected(true);
            });

            socket.on("disconnect", () => {
                setSocketConnected(false);
            });
        }

        return () => {
            if (socket && socket.active) {
                socket.disconnect();
            }

            console.log("disconnecting websocket");
        };
    }, [roomId]);

    const renderPingStatus = () => {
        if (pingIsLoading) {
            return <h1>Pinging...</h1>;
        } else {
            if (pingError) {
                return <h1>Ping errored</h1>;
            }
            return <h1>Ping worked!</h1>;
        }
    };

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
            {renderPingStatus()}
            <h1>Redis connected: {String(redisConnected?.connected)}</h1>
            <div className="flex flex-row items-center gap-4">
                <Button variant="default" disabled={randomNumIsFetching} onClick={() => randomNumRefetch()}>
                    Generate Number
                </Button>
                {randomNumIsSuccess && <h1>{randomNum?.num}</h1>}
            </div>
            <MathForm setMathResult={setMathResult}></MathForm>
            <h1>Result was {mathResult}</h1>

            {socket && socketConnected ? (
                <div>
                    <h1>SOCKET CONNECTED CHAT BELOW YOU ARE {userId}</h1>
                    <ChatMsgs socket={socket} roomId={roomId}></ChatMsgs>
                    <ChatInput socket={socket} />
                </div>
            ) : (
                <h1>Cannot connect to socket {":("}</h1>
            )}
        </div>
    );
}
