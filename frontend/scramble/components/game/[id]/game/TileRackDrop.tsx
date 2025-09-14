import { Tile } from "shared/types/tiles";
import TileView from "./TileView";
import { useDroppable } from "@dnd-kit/core";
import { memo } from "react";

interface TileRackDropProps {
    index: number;
    tile?: Tile;
    size?: number;
}

const TileRackDrop = ({ index, tile, size }: TileRackDropProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: "rackDrop" + index,
    });

    const style = {
        color: isOver ? "green" : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* Render the tile or a placeholder */}
            {tile ? (
                <TileView tile={tile} size={size} index={index} />
            ) : (
                <div
                    style={{
                        width: size,
                        height: size,
                    }}
                >
                    Drop a tile here
                </div>
            )}
        </div>
    );
};


// TODO: rerenders when another tile is being dragged for some reason
const memoHelper = (prevProps: TileRackDropProps, nextProps: TileRackDropProps) => {
    console.log("prev props:", prevProps);
    console.log("next props:", nextProps);
    return (
        prevProps.tile === nextProps.tile ||
        (prevProps.tile?.letter === nextProps.tile?.letter &&
            prevProps.tile?.enchantment === nextProps.tile?.enchantment)
    );
};

export default memo(TileRackDrop, memoHelper);