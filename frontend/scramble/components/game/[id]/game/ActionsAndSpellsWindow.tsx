import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Socket } from "socket.io-client";
import ActionWindowContent from "./ActionWindowContent";
import SpellsWindowContent from "./SpellsWindowContent";

interface ActionsAndSpellsWindowProps {
    socket: Socket;
}

export default function ActionsAndSpellsWindow({ socket }: ActionsAndSpellsWindowProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 50 });
    const [activeTab, setActiveTab] = useState<"actions" | "spells">("actions");

    const width = 300;
    const height = 410;

    const handleMinimizeToggle = () => {
        if (isMinimized) {
            // Expanding: check if window would overflow bottom edge
            const expandedBottom = position.y + height;
            const windowHeight = window.innerHeight;
            if (expandedBottom > windowHeight) {
                setPosition((pos) => ({
                    ...pos,
                    y: Math.max(0, windowHeight - height - 10), // 10px margin from bottom
                }));
            }
        }
        setIsMinimized(!isMinimized);
    };
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
            enableResizing={false}
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
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            fontWeight: activeTab === "actions" ? 700 : 400,
                            color:
                                activeTab === "actions" ? "var(--color-secondary-foreground)" : "rgba(255,255,255,0.5)",
                            opacity: activeTab === "actions" ? 1 : 0.6,
                            cursor: "pointer",
                            fontSize: "16px",
                            transition: "font-weight 0.1s, color 0.1s, opacity 0.1s",
                            minWidth: "56px", // Prevent text shift
                        }}
                        onClick={() => setActiveTab("actions")}
                    >
                        Actions
                    </button>
                    <span style={{ margin: "0 10px" }}>|</span>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            fontWeight: activeTab === "spells" ? 700 : 400,
                            color:
                                activeTab === "spells" ? "var(--color-secondary-foreground)" : "rgba(255,255,255,0.5)",
                            opacity: activeTab === "spells" ? 1 : 0.6,
                            cursor: "pointer",
                            fontSize: "16px",
                            transition: "font-weight 0.1s, color 0.1s, opacity 0.1s",
                            // minWidth: "60px", // Prevent text shift
                        }}
                        onClick={() => setActiveTab("spells")}
                    >
                        Spells
                    </button>
                </div>
                <button
                    onClick={handleMinimizeToggle}
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
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: `calc(100% - 40px)`,
                        overflowY: "auto",
                        backgroundColor: "#000000",
                        color: "var(--color-card-foreground)",
                        boxSizing: "border-box",
                    }}
                >
                    {activeTab === "actions" ? (
                        <div style={{ flex: 1, width: "100%", height: "100%" }}>
                            <ActionWindowContent socket={socket} />
                        </div>
                    ) : (
                        <div style={{ flex: 1, width: "100%", height: "100%" }}>
                            <SpellsWindowContent />
                        </div>
                    )}
                </div>
            )}
        </Rnd>
    );
}
