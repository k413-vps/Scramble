import { useGameStore } from "@/utils/game/[id]/store";
import TileRack from "@/components/game/[id]/game/TileRack";
// import ThemeToggle from "@/components/ThemeToggle";
import Board from "@/components/game/[id]/game/Board";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    rectIntersection,
} from "@dnd-kit/core";
import { DragDataTile, DragTypes, DropDataBoard, DropDataTray, DropTypes } from "@/lib/dragTypes";
import { useState } from "react";
import TileView from "@/components/game/[id]/game/TileView";
import { Tile } from "shared/types/tiles";
import Leaderboard from "@/components/game/[id]/game/Leaderboard";
import ActionsWindow from "@/components/game/[id]/game/ActionsWindow";
import SpellsWindow from "@/components/game/[id]/game/SpellsWindow";
import { Socket } from "socket.io-client";

type GamePageProps = {
    socket: Socket;
};

export default function GamePage({ socket }: GamePageProps) {
    // const hand = useGameStore((state) => state.hand);
    const numRows = useGameStore((state) => state.numRows);
    const numCols = useGameStore((state) => state.numCols);

    const playerId = useGameStore((state) => state.playerId);
    const handToHand = useGameStore((state) => state.handToHand);
    const handToBoard = useGameStore((state) => state.handToBoard);
    const boardToBoard = useGameStore((state) => state.boardToBoard);
    const boardToHand = useGameStore((state) => state.boardToHand);

    const [isDragging, setIsDragging] = useState(false);
    const [activeTile, setActiveTile] = useState<Tile | null>(null);

    function handleDragStart(event: DragStartEvent) {
        const dragData = event.active.data.current as DragDataTile;
        setIsDragging(true);
        setActiveTile(dragData.tile);
    }

    function handleDragEnd(event: DragEndEvent) {
        setIsDragging(false);
        setActiveTile(null);

        const { over, active } = event;

        if (over && active) {
            const dropType = over.data.current?.dropType;
            const dragType = active.data.current?.dragType;

            if (dropType == DropTypes.TRAY && dragType == DragTypes.TILE) {
                handleDragTileDropTray(over.data.current as DropDataTray, active.data.current as DragDataTile);
            }

            if (dropType == DropTypes.BOARD && dragType == DragTypes.TILE) {
                handleDragTileDropBoard(over.data.current as DropDataBoard, active.data.current as DragDataTile);
            }
        }
    }

    function handleDragTileDropTray(dropData: DropDataTray, dragData: DragDataTile) {
        if (dragData.dragIndex === null) {
            boardToHand(dragData.tile.position!.row, dragData.tile.position!.col, dropData.dropIndex);
            return;
        }
        handToHand(dropData.dropIndex, dragData.dragIndex!);
    }

    function handleDragTileDropBoard(dropData: DropDataBoard, dragData: DragDataTile) {
        if (dragData.dragIndex === null) {
            boardToBoard(dragData.tile.position!.row, dragData.tile.position!.col, dropData.rowNum, dropData.colNum);
            return;
        }
        handToBoard(dropData.rowNum, dropData.colNum, dragData.dragIndex);
    }

    const prioritizeDroppable: CollisionDetection = (args) => {
        const collisions = rectIntersection(args);

        if (collisions.length > 1) {
            // Sort by custom priority
            collisions.sort((a, b) => {
                const priorityA = a.data?.droppableContainer?.data?.current?.priority as number;
                const priorityB = b.data?.droppableContainer?.data?.current?.priority as number;
                return priorityB - priorityA;
            });
        }

        return collisions;
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={prioritizeDroppable}>
            <div>
                <div
                    style={{
                        height: "100vh",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <DragOverlay dropAnimation={null}>
                        {activeTile ? (
                            <div
                                style={{
                                    position: "absolute",
                                    left: 12,
                                    top: 12,
                                }}
                            >
                                <TileView tile={activeTile} size={48} />
                            </div>
                        ) : null}
                    </DragOverlay>
                    <TransformWrapper
                        disabled={isDragging}
                        minScale={0.5}
                        maxScale={2}
                        wheel={{ step: 4.2 }}
                        limitToBounds={false}
                        // looks like this does not work rn https://github.com/BetterTyped/react-zoom-pan-pinch/issues/478
                        // use limitToBounds={false} for now
                        // minPositionX={0}
                        // maxPositionX={0}
                        // minPositionY={0}
                        // maxPositionY={0}
                        initialScale={1}
                        initialPositionX={window.innerWidth / 2 - (numCols * 64) / 2}
                        initialPositionY={window.innerHeight / 2 - (numRows * 64) / 2}
                    >
                        <TransformComponent>
                            <Board />
                        </TransformComponent>
                    </TransformWrapper>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TileRack />
                    </div>
                </div>
                <Leaderboard />
                {playerId !== "" && <ActionsWindow socket={socket} />}
                <SpellsWindow />
            </div>
        </DndContext>
    );
}
