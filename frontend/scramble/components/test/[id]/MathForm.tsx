"use client";

import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "../../../lib/axios";
import { MathRequest, MathResponse } from "shared/types/API";
import { Dispatch, SetStateAction } from "react";

const schema = z.object({
    num1: z.coerce.number().min(0, "Num 1 must be a positive number"),
    num2: z.coerce.number().min(4, "Num 2 must be greater than 4"),
});

type FormValues = z.infer<typeof schema>;

type MathFormProps = {
    setMathResult: Dispatch<SetStateAction<number>>;
};

export function MathForm({ setMathResult }: MathFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { num1: 3, num2: 5 },
    });

    async function postMath(data: MathRequest): Promise<MathResponse> {
        const res: MathResponse = (await api.post("/math", data)).data;

        return res
    }


    async function onMathSuccess(mathResponse: MathResponse) {
        
        setMathResult(mathResponse.num)

    }

    const mutation = useMutation({
        mutationFn: postMath,
        onSuccess: onMathSuccess,
    });

    const onSubmit = (data: FormValues) => {
        const request: MathRequest = {
            num1: data.num1,
            num2: data.num2,
        };

        mutation.mutate(request);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="num1"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="num1">Put number</Label>
                            <FormControl>
                                <Input {...field} type="number" id="num1" />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="num2"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="num2">Put number</Label>
                            <FormControl>
                                <Input {...field} type="number" id="num2" />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
                <FormMessage />
            </form>
        </Form>
    );
}
