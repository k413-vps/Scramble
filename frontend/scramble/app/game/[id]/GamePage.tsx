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
import { Socket } from "socket.io-client";
import ActionsAndSpellsWindow from "@/components/game/[id]/game/ActionsAndSpellsWindow";
// import TurnHistory from "@/components/game/[id]/game/TurnHistory";
import GameInfo from "@/components/game/[id]/game/GameInfo";
import { PlannedToClient } from "shared/types/SocketMessages";
import { myPlannedTiles } from "@/utils/game/[id]/gameLogic";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GamePageProps = {
    socket: Socket;
};

type DialogPain = {
    open: boolean;
    dragData: DragDataTile | null;
    dropData: DropDataBoard | null;
};

export default function GamePage({ socket }: GamePageProps) {
    // const hand = useGameStore((state) => state.hand);
    const numRows = useGameStore((state) => state.numRows);
    const numCols = useGameStore((state) => state.numCols);
    const hand = useGameStore((state) => state.hand);

    const handToHand = useGameStore((state) => state.handToHand);
    const handToBoard = useGameStore((state) => state.handToBoard);
    const boardToBoard = useGameStore((state) => state.boardToBoard);
    const boardToHand = useGameStore((state) => state.boardToHand);

    const [isDragging, setIsDragging] = useState(false);
    const [activeTile, setActiveTile] = useState<Tile | null>(null);

    const isCurrentPlayer = useGameStore((state) => state.isCurrentPlayer());

    const [dialog, setDialog] = useState<DialogPain>({
        open: false,
        dragData: null,
        dropData: null,
    });

    const [blankTileLetter, setBlankTileLetter] = useState("");

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

            if (isCurrentPlayer) {
                const plannedTilesMsg: PlannedToClient = {
                    plannedTiles: myPlannedTiles(hand),
                };

                socket.emit("planned_tiles", plannedTilesMsg);
            }
            return;
        }
        handToHand(dropData.dropIndex, dragData.dragIndex!);
    }

    function handleSetBlankTileLetter() {
        console.log("our letter is ", blankTileLetter);

        const newDragData: DragDataTile = {
            ...(dialog.dragData as DragDataTile),
            tile: {
                ...(dialog.dragData as DragDataTile).tile,
                letter: blankTileLetter.toUpperCase(),
            },
        };

        setBlankTileLetter("");
        dragTileDropBoardLogic(dialog.dropData as DropDataBoard, newDragData);
        setDialog({ open: false, dragData: null, dropData: null });
    }

    function handleDragTileDropBoard(dropData: DropDataBoard, dragData: DragDataTile) {
        const dragTile = dragData.tile;
        if (dragTile.blank) {
            setDialog({
                open: true,
                dragData,
                dropData,
            });
            return;
        }

        dragTileDropBoardLogic(dropData, dragData);
    }

    function dragTileDropBoardLogic(dropData: DropDataBoard, dragData: DragDataTile) {
        const dragTile = dragData.tile;

        if (dragData.dragIndex === null) {
            boardToBoard(dragTile.position!.row, dragTile.position!.col, dropData.rowNum, dropData.colNum, dragTile.letter);

            if (isCurrentPlayer) {
                const plannedTilesMsg: PlannedToClient = {
                    plannedTiles: myPlannedTiles(hand),
                };

                socket.emit("planned_tiles", plannedTilesMsg);
            }
            return;
        }
        handToBoard(dropData.rowNum, dropData.colNum, dragData.dragIndex, dragTile.letter);

        const plannedTilesMsg: PlannedToClient = {
            plannedTiles: myPlannedTiles(hand),
        };

        if (isCurrentPlayer) {
            socket.emit("planned_tiles", plannedTilesMsg);
        }
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
        <>
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={prioritizeDroppable}
            >
                <div>
                    <div
                        style={{
                            height: "100vh",
                            width: "100vw",
                            // margin: "0 auto",
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
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TileRack socket={socket} />
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {/* <TurnHistory /> */}
                            <GameInfo socket={socket} />
                        </div>
                    </div>
                    {/* <ScoreBanner /> */}
                    <Leaderboard />
                    {/* {playerId !== "" && <ActionsWindow socket={socket} />} */}
                    {/* <SpellsWindow /> */}
                    <ActionsAndSpellsWindow socket={socket} />
                </div>
            </DndContext>
            <Dialog
                open={dialog.open}
                onOpenChange={() => {
                    /* Prevent closing */
                    //(open) => setDialog({ ...dialog, open });
                }}
            >
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Set Letter for Blank Tile</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Input
                            value={blankTileLetter}
                            onChange={(e) => setBlankTileLetter(e.target.value)}
                            placeholder="Enter a letter"
                            maxLength={1}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSetBlankTileLetter} disabled={!blankTileLetter.match(/^[A-Za-z]$/)}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
