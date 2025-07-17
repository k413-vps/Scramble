"use client";

import { Button } from "@/components/ui/button";

import { Ping, RandomNumResponse } from "shared/types/API";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../lib/axios";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { MathForm } from "@/components/test/MathForm";
import { useState } from "react";

async function getPing(): Promise<Ping> {
    const res = await api.get("/ping");
    return res.data;
}

async function getRandomNum(): Promise<RandomNumResponse> {
    const res = await api.get("/randomNum");
    return res.data;
}

export default function Page() {
    const params = useParams();
    const id = params.id;

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

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1>Lobby #{id}</h1>
            <h2>
                This is a test page to test the connections between front and backend. Right now, it tests getting the
                lobby #, a get request, a post request with no body, and a post request through a form.{" "}
            </h2>
            <h1>Ping: {ping?.message}</h1>
            <div className="flex flex-row items-center gap-4">
                <Button variant="default" disabled={randomNumIsFetching} onClick={() => randomNumRefetch()}>
                    Generate Number
                </Button>
                {randomNumIsSuccess && <h1>{randomNum?.num}</h1>}
            </div>
            <MathForm setMathResult={setMathResult}></MathForm>
            <h1>Result was {mathResult}</h1>
            <button onClick={() => console.log("test")}>ugle</button>
        </div>
    );
}
