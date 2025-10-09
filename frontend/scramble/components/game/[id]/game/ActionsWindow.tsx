import { useGameStore } from "@/utils/game/[id]/store";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import ActionsEntry from "./ActionsEntry";
import { actions, ActionType, PlaceAction } from "shared/types/actions";
import { calculateScore } from "@/utils/game/[id]/gameLogic";
import { Socket } from "socket.io-client";
import { ActionToServer } from "shared/types/SocketMessages";
import ScorePill from "./ScorePill";
import { handlePlay, handlePass, handleShuffle, handleWrite, handleSacrifice } from "@/utils/game/[id]/HandleActions";
import ActionWindowContent from "./ActionWindowContent";
interface ActionsWindowProps {
    socket: Socket;
}

export default function ActionsWindow({ socket }: ActionsWindowProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 50 });
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
                <span style={{ fontWeight: "bold" }}>Actions</span>
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
            {!isMinimized && <ActionWindowContent socket={socket} />}
        </Rnd>
    );
}
