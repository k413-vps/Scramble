"use client";

import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-20 w-20 animate-spin" />
        </div>
    );
}
