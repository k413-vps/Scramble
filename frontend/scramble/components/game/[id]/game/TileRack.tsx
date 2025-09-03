import React from "react";
import { Tile } from "shared/types/tiles";
import TileView from "./TileView";

interface TileRackProps {
    tiles: Tile[];
    maxSize?: number; // Maximum pixel size for a tile
    minSize?: number; // Minimum pixel size for a tile
    rackWidth?: number; // Total width of the rack in px
}

export default function TileRack({ tiles, maxSize = 64, minSize = 32, rackWidth = 800 }: TileRackProps) {
    const tileSize = Math.max(minSize, Math.min(maxSize, Math.floor(rackWidth / Math.max(tiles.length, 1)) - 8));

    return (
        <div
            className="flex items-center justify-center gap-2 px-2 py-3 bg-neutral-100 rounded-xl shadow"
            style={{ width: rackWidth, minHeight: tileSize * 2 }}
        >
            {tiles.map((tile, idx) => (
                <TileView key={idx} tile={tile} size={tileSize} />
            ))}
        </div>
    );
}
