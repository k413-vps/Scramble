import { useGameStore } from "@/utils/game/[id]/store";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import ActionsEntry from "./ActionsEntry";
import { actions, ActionType, PlaceAction } from "shared/types/actions";
import { validPlay } from "@/utils/game/[id]/gameLogic";
import { Socket } from "socket.io-client";
import { ActionToServer } from "shared/types/SocketMessages";

interface ActionsWindowProps {
    socket: Socket;
}

export default function ActionsWindow({ socket }: ActionsWindowProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 50 });

    const player = useGameStore((state) => state.getPlayer());
    const playerId = useGameStore((state) => state.playerId);
    const currentPlayerId = useGameStore((state) => state.currentPlayerId);
    const dictionaryEnum = useGameStore((state) => state.dictionary);
    const board = useGameStore((state) => state.board);
    const enhancements = useGameStore((state) => state.enhancements);
    const hand = useGameStore((state) => state.hand);

    const isValidPlay = validPlay(board, enhancements, dictionaryEnum);
    const isCurrentPlayer = playerId === currentPlayerId;


    const mana = player === null ? -1 : player.mana;

    const width = 300;
    const height = 400;

    function handlePlay() {
        const actionData: PlaceAction = {
            type: ActionType.PLAY,
            hand: hand,
            playerId: currentPlayerId,
            points: 0,
            mana: 0,
        };

        const message: ActionToServer = {
            actionData: actionData,
        };

        socket.emit("action", message);
    }

    function handlePass() {}

    function handleShuffle() {}

    function handleWrite() {}

    function handleSacrifice() {}

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
                        <ActionsEntry
                            action={actions[ActionType.PLAY]}
                            onClick={handlePlay}
                            disabled={!isCurrentPlayer || !isValidPlay}
                        />
                        <ActionsEntry
                            action={actions[ActionType.PASS]}
                            onClick={handlePass}
                            disabled={!isCurrentPlayer}
                        />
                        <ActionsEntry
                            action={actions[ActionType.SHUFFLE]}
                            onClick={handleShuffle}
                            disabled={!isCurrentPlayer}
                        />
                        <ActionsEntry
                            action={actions[ActionType.WRITE]}
                            onClick={handleWrite}
                            disabled={mana < actions[ActionType.WRITE].cost || !isCurrentPlayer}
                        />
                        <ActionsEntry
                            action={actions[ActionType.SACRIFICE]}
                            onClick={handleSacrifice}
                            disabled={!isCurrentPlayer}
                        />
                    </div>
                </div>
            )}
        </Rnd>
    );
}
