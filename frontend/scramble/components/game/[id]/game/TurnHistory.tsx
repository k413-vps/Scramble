import { CSSProperties, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGameStore } from "@/utils/game/[id]/store";
import { ActionHistory, ClientSidePlayer, HistoryType, SpellHistory, HistoryElement } from "shared/types/game";
import { getMessage } from "@/utils/game/[id]/History";
import Image from "next/image";

export default function TurnHistory() {
    const turnHistory = useGameStore((s) => s.turnHistory);
    const players = useGameStore((s) => s.players);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(turnHistory.length - 1);
    }, [turnHistory]);

    const containerStyle: CSSProperties = {
        backgroundColor: "var(--color-card)",
        height: "120px",
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
                        // alignItems: "center",
                        gap: 12,
                        flex: 1,
                        width: "100%",
                        padding: "12px",
                        paddingTop: 5,
                        height: "90px",
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
                        // alignItems: "center",
                        gap: 12,
                        flex: 1,
                        width: "100%",
                        padding: "12px",
                        paddingTop: 5,
                        height: "90px",
                    }}
                >


                    No turns yet!!!!
                </div>
            )}
        </div>
    );
}
