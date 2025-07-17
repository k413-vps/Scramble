import { Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { TestMessageToClient } from "shared/types/SocketMessages";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatMsgsProps = {
    socket: Socket;
};

export default function ChatMsgs({ socket }: ChatMsgsProps) {
    const [items, setItems] = useState<TestMessageToClient[]>([]);

    const handleMessage = (msg: TestMessageToClient) => {
        console.log(`recieved msg from ${msg.userId}: ${msg.message}`);
        setItems((oldData) => {
            return [...oldData, msg];
        });
    };

    useEffect(() => {
        socket.on("msg_to_client", handleMessage);

        return () => {
            socket.off("msg_to_client", handleMessage);
        };
    });

    useEffect(() => {
        // has to be seperate. tried putting it in the same it did not work ):
        if (items.length != 0) endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [items]);

    const endRef = useRef<HTMLDivElement | null>(null);

    return (
        <ScrollArea className="h-[300px] overflow-y-auto border rounded-xl">
            <div className="grid gap-4 p-4">
                {items.map((item, index) => (
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
