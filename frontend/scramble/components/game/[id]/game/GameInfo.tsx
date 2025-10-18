import { CSSProperties, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGameStore } from "@/utils/game/[id]/store";
import { ActionHistory, ClientSidePlayer, HistoryType, SpellHistory, HistoryElement } from "shared/types/game";
import { getMessage } from "@/utils/game/[id]/History";
import Image from "next/image";
import { Socket } from "socket.io-client";
import { handlePass } from "@/utils/game/[id]/HandleActions";

type GameInfoProps = { socket: Socket };

export default function GameInfo({ socket }: GameInfoProps) {
    const turnHistory = useGameStore((s) => s.turnHistory);
    const players = useGameStore((s) => s.players);
    const timePerTurn = useGameStore((s) => s.timePerTurn);
    const timeOfLastTurn = useGameStore((s) => s.timeOfLastTurn);
    const tilesRemaining = useGameStore((s) => s.tilesRemaining);
    const currentPlayerId = useGameStore((s) => s.currentPlayerId);

    const [index, setIndex] = useState(0);
    const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null);

    useEffect(() => {
        setIndex(turnHistory.length - 1);
    }, [turnHistory]);

    useEffect(() => {
        let id: ReturnType<typeof setInterval> | null = null;

        const calc = () => {
            if (timePerTurn === 0) {
                setTimeLeftMs(null); // No timer
                return;
            }
            const elapsed = Date.now() - timeOfLastTurn;
            const remaining = Math.max(0, timePerTurn * 1000 - elapsed);
            setTimeLeftMs(remaining);

            if (remaining <= 0 && id !== null) {
                clearInterval(id);
                id = null;

                handlePass(socket, currentPlayerId);
            }
        };

        calc();
        if (timePerTurn !== 0) {
            id = setInterval(calc, 500);
        }
        return () => {
            if (id !== null) clearInterval(id);
        };
    }, [timePerTurn, timeOfLastTurn]);

    const formatTime = (ms: number | null) => {
        if (ms === null) return "∞"; // Infinity sign for no timer
        let cappedMS = Math.min(timePerTurn * 1000, ms);
        const seconds = Math.floor(cappedMS / 1000);
        const mm = Math.floor(seconds / 60);
        const ss = seconds % 60;
        return `${mm}:${ss.toString().padStart(2, "0")}`;
    };

    const containerStyle: CSSProperties = {
        backgroundColor: "var(--color-card)",
        height: "140px",
        width: "560px",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
        // prevent text selection / highlight
        userSelect: "none",
    };

    const current = turnHistory[index];

    const message = getMessage(players, current);

    let player: ClientSidePlayer | undefined = undefined;

    if (current && current.type === HistoryType.ACTION) {
        player = players[(current as ActionHistory).actionData.playerId];
    } else if (current && current.type === HistoryType.SPELL) {
        player = players[(current as SpellHistory).spellData.playerId];
    }

    return (
        <div style={containerStyle}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                    backgroundColor: " var(--background)",
                    width: "100%",
                    justifyContent: "center",
                    gap: 8,
                    padding: "0 8px",
                    borderTopLeftRadius: "var(--radius-md)",
                    borderTopRightRadius: "var(--radius-md)",
                }}
            >
                <Button
                    variant="ghost"
                    size="xsm"
                    onClick={() => setIndex(index - 1)}
                    disabled={index <= 0}
                    aria-label="previous turn"
                >
                    <ChevronLeft />
                </Button>

                <div style={{ fontWeight: 600, fontSize: 18 }}>History</div>

                <Button
                    variant="ghost"
                    size="xsm"
                    onClick={() => setIndex(index + 1)}
                    disabled={index >= turnHistory.length - 1}
                    aria-label="next turn"
                >
                    <ChevronRight />
                </Button>
            </div>

            {player ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                        width: "100%",
                        padding: "12px",
                        paddingTop: 5,
                        marginLeft: 8,
                        height: "70px",
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 999,
                            overflow: "hidden",
                            backgroundColor: "var(--muted-foreground)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Image
                            src={player.profilePicture}
                            alt={player?.name ?? "player"}
                            width={56}
                            height={56}
                            style={{ objectFit: "cover" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontWeight: 600 }}>Turn {`#${index + 1}`}</div>
                        <div style={{ color: "var(--muted-foreground)", maxWidth: 480, wordBreak: "break-word" }}>
                            {message}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        flex: 1,
                        width: "100%",
                        padding: "12px",
                        paddingTop: 5,
                        height: "90px",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ fontWeight: 600 }}>No turns yet</div>
                        <div style={{ color: "var(--muted-foreground)" }}>
                            The first turn will appear here once a player takes it.
                        </div>
                    </div>
                </div>
            )}

            {/* Footer showing time left and tiles remaining */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "40px", // Increased height for better visibility
                    backgroundColor: "var(--background)",
                    width: "100%",
                    gap: 8,
                    padding: "0 12px",
                    borderBottomLeftRadius: "var(--radius-md)",
                    borderBottomRightRadius: "var(--radius-md)",
                    fontSize: 16, // Increased font size
                    fontWeight: 700, // Made text bold
                    color: "var(--foreground)", // More prominent color
                }}
            >
                <div>
                    Time left:{" "}
                    <span style={{ fontWeight: 800, color: "var(--primary)" }}>{formatTime(timeLeftMs)}</span>
                </div>
                <div>
                    Tiles left: <span style={{ fontWeight: 800, color: "var(--primary)" }}>{tilesRemaining}</span>
                </div>
            </div>
        </div>
    );
}
