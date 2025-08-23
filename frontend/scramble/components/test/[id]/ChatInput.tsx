import { z } from "zod";

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TestMessageToServer } from "shared/types/SocketMessages";
import { Socket } from "socket.io-client";

type ChatInputProps = {
    socket: Socket;
};

const schema = z.object({
    msg: z.coerce.string().max(50, "Message too long :/").min(1, "Message too short :/"),
});

type FormValues = z.infer<typeof schema>;

export default function ChatInput({ socket }: ChatInputProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { msg: "" },
    });

    const onSubmit = (data: FormValues) => {
        const socketRequest: TestMessageToServer = {
            message: data.msg,
        };
        socket.emit("test_chat_msg_to_server", socketRequest);
        form.reset({ msg: "" });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="msg"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="msg">Put msg</Label>
                            <FormControl>
                                <Input {...field} type="text" id="msg" />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
