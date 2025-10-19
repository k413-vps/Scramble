"use client";

import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "@/lib/axios";
import { CreateGameRequest, CreateGameResponse } from "shared/types/API";
// import { generateSeed } from "shared/game/util";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Loader2 } from "lucide-react";
import { createGameFormSchema, CreateGameFormValues } from "@/utils/create/formType";
import { DictionaryEnum } from "shared/types/game";
import { formToRequest } from "@/utils/create/helper";

export function CreateGameForm() {
    const router = useRouter();

    const form = useForm<CreateGameFormValues>({
        resolver: zodResolver(createGameFormSchema),
        defaultValues: {
            handSize: 7,
            board: "letter league",
            length: "short",
            dictionary: DictionaryEnum.twl06,
            wildMode: true,
            enableEnchantments: true,
            enableSpecialActions: true,
            public: true,
            timePerTurn: 300,
            seed: "",
        },
    });

    const mutation = useMutation({
        mutationFn: postCreate,
        onSuccess: onCreateSuccess,
    });

    const onSubmit = (data: CreateGameFormValues) => {
        const request = formToRequest(data);

        mutation.mutate(request);
    };

    async function postCreate(data: CreateGameRequest): Promise<CreateGameResponse> {
        const res: CreateGameResponse = (await api.post(`${process.env.NEXT_PUBLIC_BACKEND_AUTH_PATH}/create`, data))
            .data;

        return res;
    }

    async function onCreateSuccess(createResponse: CreateGameResponse) {
        const roomId = createResponse.roomId;
        router.replace(`game/${roomId}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="handSize"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="handSize">Hand Size</Label>
                            <FormControl>
                                <Input {...field} type="number" id="handSize" />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="seed"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="seed">Seed (leave blank for random seed)</Label>
                            <FormControl>
                                <Input {...field} id="seed" />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="timePerTurn"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="timePerTurn">Time per turn (in seconds) (leave blank for no timer)</Label>
                            <FormControl>
                                <Input {...field} id="timePerTurn" />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="board"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Choose board</Label>
                            <Select onValueChange={field.onChange} defaultValue="letter league">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="letter league">letter league</SelectItem>
                                    <SelectItem value="scrabble">scrabble</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Choose length</Label>
                            <Select onValueChange={field.onChange} defaultValue="short">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="short">short</SelectItem>
                                    <SelectItem value="medium">medium</SelectItem>
                                    <SelectItem value="long">long</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dictionary"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Choose dictionary</Label>
                            <Select onValueChange={field.onChange} defaultValue="twl06">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="twl06">twl06</SelectItem>
                                    <SelectItem value="sowpods">sowpods</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="wildMode"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <Label>Wild Mode</Label>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="enableEnchantments"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <Label>Enable Enchantments</Label>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="enableSpecialActions"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <Label>Enable Special Actions</Label>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="public"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <Label>public</Label>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 /> : "Create"}
                </Button>
                <FormMessage />
            </form>
        </Form>
    );
}
