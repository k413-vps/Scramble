import React from "react";
// import { Tile } from "shared/types/tiles";
import TileView from "./TileView";
import { useGameStore } from "@/utils/game/[id]/store";

export default function TileRack() {
    const tileSize = 64; // Math.max(minSize, Math.min(maxSize, Math.floor(rackWidth / Math.max(tiles.length, 1)) - 8));

    const tiles = useGameStore((state) => state.hand);

    const rackWidth = tileSize * (tiles.length + 1);

    return (
        <div
            className="flex flex-row items-center justify-center gap-2
                rounded-xl shadow-lg backdrop-blur-md
                bg-white/30 border border-white/40"
            style={{ width: rackWidth, height: tileSize * 1.8 }}
        >
            {tiles.map((tile, idx) => (
                <TileView key={idx} tile={tile} size={tileSize} />
            ))}
        </div>
    );
}
