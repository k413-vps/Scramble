import { useGameStore } from "@/utils/game/[id]/store";
import TileRack from "@/components/game/[id]/game/TileRack";
// import ThemeToggle from "@/components/ThemeToggle";
import Board from "@/components/game/[id]/game/Board";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { DragDataTile, DragTypes, DropDataBoard, DropDataTray, DropTypes } from "@/lib/dragTypes";

export default function GamePage() {
    // const hand = useGameStore((state) => state.hand);
    const numRows = useGameStore((state) => state.numRows);
    const numCols = useGameStore((state) => state.numCols);

    const swapHandTiles = useGameStore((state) => state.swapHandTiles);

    function handleDragEnd(event: DragEndEvent) {
        const { over, active } = event;

        if (over && active) {
            const dropType = over.data.current?.dropType;
            const dragType = active.data.current?.dragType;

            if (dropType == DropTypes.TRAY && dragType == DragTypes.TILE) {
                handleDragTileDropTray(over.data.current as DropDataTray, active.data.current as DragDataTile);
            }

            if (dropType == DropTypes.BOARD) {
                handleDragTileDropBoard(over.data.current as DropDataBoard, active.data.current as DragDataTile);
            }
        }
    }

    function handleDragTileDropTray(dropData: DropDataTray, dragData: DragDataTile) {
        console.log("Drag tile drop tray");
        swapHandTiles(dropData.dropIndex, dragData.dragIndex);
    }

    function handleDragTileDropBoard(dropData: DropDataBoard, dragData: DragDataTile) {
        console.log("Drag tile drop board");
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
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
                    <TransformWrapper
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
                            pointerEvents: "auto",
                        }}
                    >
                        <TileRack />
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
