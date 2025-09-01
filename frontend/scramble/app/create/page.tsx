"use client";

import { CreateGameForm } from "@/components/create/CreateGameForm";
import LoadingPage from "@/components/LoadingPage";
import { useEffect, useState } from "react";

export default function Create() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <LoadingPage />;
    }
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1>Please make a game</h1>
            <CreateGameForm />
        </div>
    );
}
