import React from "react";
import { Tile } from "shared/types/tiles";
import TileView from "./TileView";
import { useGameStore } from "@/utils/game/[id]/store";




export default function TileRack() {
    const tileSize = 64; // Math.max(minSize, Math.min(maxSize, Math.floor(rackWidth / Math.max(tiles.length, 1)) - 8));

    const rackWidth = window.innerWidth;
    const tiles = useGameStore((state) => state.hand);

    return (
        <div
            className="flex flex-row items-center justify-center gap-2  "
            style={{ width: rackWidth, minHeight: tileSize * 2, background: "var(--color-muted-foreground)" }}
        >
            {tiles.map((tile, idx) => (
                <TileView key={idx} tile={tile} size={tileSize} />
            ))}
        </div>
    );
}
