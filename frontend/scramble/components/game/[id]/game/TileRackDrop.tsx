import { Tile } from "shared/types/tiles";
import TileView from "./TileView";
import { useDroppable } from "@dnd-kit/core";
import { memo } from "react";
import { DropDataTray, DropTypes } from "@/lib/dragTypes";

interface TileRackDropProps {
    index: number;
    tile: Tile | null;
    size: number;
}

const TileRackDrop = ({ index, tile, size }: TileRackDropProps) => {
    const dropData: DropDataTray = {
        dropIndex: index,
        dropType: DropTypes.TRAY,
        priority: 3,
    };

    const { isOver, setNodeRef } = useDroppable({
        id: "rackDrop." + index,
        data: dropData,
    });

    const style = {
        width: size * 1.2,
        height: size * 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: isOver ? "2px solid #4F8EF7" : "",
        // background: isOver ? "#e6f0ff" : "#f9f9f9",
        borderRadius: 8,
        boxShadow: isOver ? "0 0 8px #4F8EF7" : undefined,
        transition: "border 0.2s, background 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        zIndex: 100,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* Render the tile or a placeholder */}
            {tile ? (
                <TileView tile={tile} size={size} index={index} />
            ) : (
                <div
                    style={{
                        width: size * 1.2,
                        height: size * 1.2,
                    }}
                ></div>
            )}
        </div>
    );
};

// TODO: rerenders when another tile is being dragged for some reason
const memoHelper = (prevProps: TileRackDropProps, nextProps: TileRackDropProps) => {
    return (
        prevProps.tile === nextProps.tile ||
        (prevProps.tile?.letter === nextProps.tile?.letter &&
            prevProps.tile?.enchantment === nextProps.tile?.enchantment)
    );
};

export default memo(TileRackDrop, memoHelper);
