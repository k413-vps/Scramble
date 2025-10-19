import React, { useEffect, useState } from "react";
import { useGameStore } from "@/utils/game/[id]/store";
import TileRackDrop from "./TileRackDrop";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { Socket } from "socket.io-client";
import { PlannedToClient } from "shared/types/SocketMessages";
import { myPlannedTiles } from "@/utils/game/[id]/gameLogic";

type TileRackProps = {
    socket: Socket;
};

export default function TileRack({ socket }: TileRackProps) {
    const tileSize = 64;

    const tiles = useGameStore((state) => state.hand);

    const recall = useGameStore((state) => state.recallTiles);

    const rackWidth = tileSize * 1.4 * tiles.length;

    const [rendered, setRendered] = useState<{ [key: number]: boolean }>({});

    const [initialRenderDone, setInitialRenderDone] = useState(false);

    const isCurrentPlayer = useGameStore((state) => state.isCurrentPlayer());

    useEffect(() => {
        setInitialRenderDone(true);
    }, []);

    // Track the tiles that exist on the first render
    useEffect(() => {
        for (const tile of tiles) {
            if (tile.position !== null) setRendered((prev) => ({ ...prev, [tile.id]: true }));
        }
    }, [tiles]);

    console.log("re render whole rack");

    const anyTilePlaced = tiles.some((tile) => tile.position !== null);

    const handleRecall = () => {
        recall();
        setRendered({});

        if (isCurrentPlayer) {
            const plannedTilesMsg: PlannedToClient = {
                plannedTiles: myPlannedTiles(tiles),
            };

            socket.emit("planned_tiles", plannedTilesMsg);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className="relative flex flex-row items-center justify-center gap-2 rounded-xl shadow-lg backdrop-blur-md bg-white/30 border border-white/40"
                style={{ width: rackWidth, height: tileSize * 1.8, zIndex: 100 }}
            >
                {/* Animated Button on top right */}
                <AnimatePresence>
                    {anyTilePlaced && (
                        <motion.div
                            key="recall"
                            initial={{ opacity: 0, y: -20, scale: 0.5 }}
                            animate={{ opacity: 1, y: -40, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.5 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute"
                            style={{ top: "-1rem", right: "0.5rem" }} // Raise higher and move left
                        >
                            <Button
                                variant="secondary2"
                                size="lg2"
                                onClick={handleRecall}
                                className="flex items-center gap-2 px-3 py-1.5"
                            >
                                <Undo2 className="w-5 h-5" />
                                <span>recall</span>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {tiles.map((tile, index) => (
                    <motion.div
                        // i believe the key needs to be different to reanimate on recall
                        key={tile.position ? `tile-ind-${index}` : `tile-${tile.id}`}
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
                                delay: initialRenderDone ? 0 : index * 0.3,
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
        </div>
    );
}
