import React, { useEffect, useState } from "react";
import { useGameStore } from "@/utils/game/[id]/store";
import TileRackDrop from "./TileRackDrop";
import { motion } from "framer-motion";

export default function TileRack() {
    const tileSize = 64;

    const tiles = useGameStore((state) => state.hand);

    const rackWidth = tileSize * (tiles.length + 2);

    const [rendered, setRendered] = useState<{ [key: number]: boolean }>({});

    // Track the tiles that exist on the first render
    useEffect(() => {
        for (const tile of tiles) {
            if (tile.position !== null) setRendered((prev) => ({ ...prev, [tile.id]: true }));
        }
    }, [tiles]);

    console.log("re render whole rack");

    return (
        <div
            className="flex flex-row items-center justify-center gap-2 rounded-xl shadow-lg backdrop-blur-md bg-white/30 border border-white/40"
            style={{ width: rackWidth, height: tileSize * 1.8, zIndex: 100, position: "relative" }}
        >
            {tiles.map((tile, index) => (
                <motion.div
                    key={tile.position ? `tile-${index}` : `tile-${tile.id}`}
                    layout
                    initial={
                        !rendered[tile.id]
                            ? { scale: 0 } // Initial animation for first render tiles
                            : false // No animation for new tiles
                    }
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        scale: {
                            ease: "easeOut",
                            delay: index * 0.3,
                            duration: 0.5,
                        },
                    }}
                >
                    <TileRackDrop
                        key={`tileTrayKey${index}`}
                        tile={tile.position ? null : tile}
                        size={tileSize}
                        index={index}
                    />
                </motion.div>
            ))}
        </div>
    );
}
