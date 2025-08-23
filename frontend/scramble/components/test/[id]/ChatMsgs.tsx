import { Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { TestMessageToClient } from "shared/types/SocketMessages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "../../../lib/axios";
import { ChatMsgsResponse } from "shared/types/API";
import { ParamValue } from "next/dist/server/request/params";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ChatMsgsProps = {
    socket: Socket;
    roomId: ParamValue;
};

export default function ChatMsgs({ socket, roomId }: ChatMsgsProps) {
    // const [chatMsgs, setChatMsgs] = useState<TestMessageToClient[]>([]);

    async function getChatMsgs(): Promise<TestMessageToClient[]> {
        const res = (await api.get(`/chat_msgs/${roomId}`)).data as ChatMsgsResponse;

        return res.messages;
    }

    const { data: chatMsgs } = useQuery({ queryKey: ["chatMsgs"], queryFn: getChatMsgs });

    const queryClient = useQueryClient();

    const handleMessage = (msg: TestMessageToClient) => {
        console.log(`recieved msg from ${msg.userId}: ${msg.message}`);

        queryClient.setQueryData(["chatMsgs"], (oldData: TestMessageToClient[]): TestMessageToClient[] => {
            return [...oldData, msg];
        });
    };

    useEffect(() => {
        socket.on("test_chat_msg_to_client", handleMessage);

        return () => {
            socket.off("test_chat_msg_to_client", handleMessage);
        };
    }, []);

    useEffect(() => {
        // has to be seperate. tried putting it in the same it did not work ):
        if (chatMsgs && chatMsgs.length != 0) endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMsgs]);

    const endRef = useRef<HTMLDivElement | null>(null);

    return (
        <ScrollArea className="h-[300px] overflow-y-auto border rounded-xl">
            <div className="grid gap-4 p-4">
                {chatMsgs?.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{item.userId}</CardTitle>
                        </CardHeader>
                        <CardContent>{item.message}</CardContent>
                    </Card>
                ))}
                <div ref={endRef} />
            </div>
        </ScrollArea>
    );
}
