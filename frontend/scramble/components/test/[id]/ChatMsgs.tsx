import { Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
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
        console.log(`recieved msg from ${msg.username}: ${msg.message}`);

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

    const scrollAreaRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatMsgs && chatMsgs.length != 0 && scrollAreaRef.current) {
            const scrollableElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");

            if (scrollableElement) {
                // Assert the type to HTMLElement to access properties like scrollHeight
                scrollableElement.scroll({
                    top: scrollableElement.scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    }, [chatMsgs]);

    return (
        <ScrollArea ref={scrollAreaRef} className="h-[300px] overflow-y-auto border rounded-xl">
            <div className="grid gap-4 p-4">
                {chatMsgs?.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{item.username}</CardTitle>
                        </CardHeader>
                        <CardContent>{item.message}</CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
}
