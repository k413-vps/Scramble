import React from "react";
// import { Tile } from "shared/types/tiles";
import { useGameStore } from "@/utils/game/[id]/store";
import TileRackDrop from "./TileRackDrop";
import { motion, AnimatePresence } from "framer-motion";

export default function TileRack() {
    const tileSize = 64; // Math.max(minSize, Math.min(maxSize, Math.floor(rackWidth / Math.max(tiles.length, 1)) - 8));

    const tiles = useGameStore((state) => state.hand);

    const rackWidth = tileSize * (tiles.length + 2);

    console.log("re render whole rack");
    // AnimatePresence is for enter/exit, but layout animations are handled by motion.div with layout prop
    return (
        <div
            className="flex flex-row items-center justify-center gap-2 rounded-xl shadow-lg backdrop-blur-md bg-white/30 border border-white/40"
            style={{ width: rackWidth, height: tileSize * 1.8 }}
        >
            {tiles.map((tile, index) => (
                <motion.div
                    key={`tileTrayKey${index}`}
                    layout // enables swap animation
                    transition={{
                        layout: {
                            type: "spring",
                            stiffness: 600,
                            damping: 40,
                        },
                        scale: { type: "spring", stiffness: 500, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                >
                    <TileRackDrop key={`tileTrayKey${index}`} tile={tile} size={tileSize} index={index} />
                </motion.div>
            ))}
        </div>
    );
}
