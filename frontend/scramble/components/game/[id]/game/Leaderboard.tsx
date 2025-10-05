import { useGameStore } from "@/utils/game/[id]/store";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import LeaderboardPlayer from "./LeaderboardEntry";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Leaderboard() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const players = useGameStore((state) => state.players);

    const currentPlayer = useGameStore((state) => state.currentPlayerId);

    const width = 300;
    const height = 400;

    return (
        <Rnd
            size={{ width: width, height: isMinimized ? 40 : height }}
            position={position}
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            minWidth={200}
            minHeight={40}
            bounds="parent"
            dragHandleClassName="leaderboard-drag-handle"
            style={{
                zIndex: 1000,
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
            }}
            enableResizing={false} // Disable resizing
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    backgroundColor: "var(--color-secondary)",
                    borderBottom: "1px solid var(--color-border)",
                    cursor: "grab",
                    color: "var(--color-secondary-foreground)",
                }}
                className="leaderboard-drag-handle"
            >
                <span style={{ fontWeight: "bold" }}>Leaderboard</span>
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "var(--color-secondary-foreground)",
                    }}
                >
                    {isMinimized ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
            </div>
            {!isMinimized && (
                <div
                    style={{
                        padding: "16px",
                        overflowY: "auto",
                        height: "calc(100% - 40px)",
                        backgroundColor: "#000000",
                        color: "var(--color-card-foreground)",
                    }}
                >
                    <div>
                        {players.map((player, index) => (
                            <LeaderboardPlayer
                                key={player.id}
                                player={player}
                                index={index}
                                currentPlayer={player.id === currentPlayer}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Rnd>
    );
}
