import { useGameStore } from "@/utils/game/[id]/store";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import SpellsEntry from "./SpellsEntry";
import { spellList } from "shared/types/spells";

export default function SpellsWindow() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 500 });

    const player = useGameStore((state) => state.getPlayer());

    const mana = player === null ? -1 : player.mana;

    const width = 300;
    const height = 400;
    console.log(spellList, "spells me");
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
                <span style={{ fontWeight: "bold" }}>Spells</span>
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
                        {spellList.map((spell, index) => (
                            <SpellsEntry key={spell.type} spell={spell} index={index} mana={mana} />
                        ))}
                    </div>
                </div>
            )}
        </Rnd>
    );
}
