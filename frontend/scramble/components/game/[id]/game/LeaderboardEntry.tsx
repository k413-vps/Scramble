import React from "react";
import { ClientSidePlayer } from "shared/types/game";

interface LeaderboardPlayerProps {
    player: ClientSidePlayer;
    index: number;
    currentPlayer: boolean;
}

export default function LeaderboardPlayer({ player, index, currentPlayer }: LeaderboardPlayerProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: index % 2 === 0 ? "var(--color-card)" : "var(--color-secondary)",
                color: "var(--color-card-foreground)",
                borderRadius: "8px",
                boxShadow: currentPlayer ? "0 0 10px 2px #E91E63" : "none", // Add a glowing effect for the current player
                transform: currentPlayer ? "scale(1.05)" : "none", // Slightly enlarge the current player's entry
                transition: "all 0.3s ease", // Smooth transition for the effects
            }}
        >
            <img
                src={player.profilePicture}
                alt={`${player.name}'s profile`}
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "16px",
                    border: "2px solid var(--color-border)",
                }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                        marginBottom: "4px",
                        overflow: "hidden", // Prevent overflow
                        whiteSpace: "nowrap", // Prevent wrapping
                        maxWidth: "150px", // Set a maximum width to ensure truncation
                    }}
                >
                    {player.name}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>{player.points} pts</span>
                    <span>{player.mana} mana</span>
                </div>
            </div>
        </div>
    );
}
