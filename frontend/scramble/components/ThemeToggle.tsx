// components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted)
        return (
            <Button size="icon" aria-label="Toggle theme">
                {/* <Moon className="h-5 w-5" /> */}
                <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
        );

    const isDark = (theme ?? resolvedTheme) === "dark";

    return (
        <Button
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="relative"
        >
            {isDark ? <Moon /> : <Sun />}
        </Button>
    );
}
