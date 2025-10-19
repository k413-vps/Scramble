import { BoardTile, BoardTileType, Enhancement } from "shared/types/game";
import TileView from "./TileView";
import { Tile } from "shared/types/tiles";
import { memo } from "react";
import { Sparkle, Star } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { DropDataBoard, DropTypes } from "@/lib/dragTypes";
import { motion } from "framer-motion";

type BoardTileProps = {
    cell: BoardTile | null;
    enhancement: Enhancement;
    rowNum: number;
    colNum: number;

    initialRender: boolean;
};

function getEnhancementClass(enhancement: Enhancement) {
    switch (enhancement) {
        case Enhancement.DOUBLE_LETTER:
            return "bg-blue-200 text-blue-900 border-blue-400 border-2";
        case Enhancement.TRIPLE_LETTER:
            return "bg-blue-400 text-white border-blue-600 border-2";
        case Enhancement.DOUBLE_WORD:
            return "bg-red-200 text-red-900 border-red-400 border-2";
        case Enhancement.TRIPLE_WORD:
            return "bg-red-400 text-white border-red-600 border-2";
        case Enhancement.START:
            return "bg-yellow-200 text-yellow-900 border-yellow-400 border-2";
        case Enhancement.DOUBLE_START:
            return "bg-yellow-400 text-white border-yellow-600 border-2";
        case Enhancement.MANA:
            return "bg-purple-200 text-purple-900 border-purple-400 border-2";
        case Enhancement.NONE:
            return "bg-gray-100 text-gray-700 border-gray-300 border";
    }
}

// maybe expand later for other enhancements
function getEnchancementLetter(enhancement: Enhancement, size: number) {
    if (enhancement === Enhancement.MANA) {
        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: size * 0.6,
                }}
            >
                <Sparkle size={size * 0.6} className="text-purple-500" />
            </div>
        );
    }

    if (enhancement === Enhancement.START) {
        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: size * 0.6,
                }}
            >
                <Star size={size * 0.6} className="text-yellow-500" />
            </div>
        );
    }

    if (enhancement === Enhancement.DOUBLE_START) {
        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: size * 0.6,
                }}
            >
                <Star size={size * 0.6} />
            </div>
        );
    }

    return (
        <h1
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: size * 0.6,
            }}
        >
            {enhancement}
        </h1>
    );
}

const BoardCell = ({ cell, enhancement, rowNum, colNum, initialRender }: BoardTileProps) => {
    const size = 64;


    const dropData: DropDataBoard = {
        dropType: DropTypes.BOARD,
        rowNum,
        colNum,
        priority: -1,
    };
    const { isOver, setNodeRef } = useDroppable({
        id: "boardDrop" + rowNum + "-" + colNum,
        data: dropData,
        disabled: cell !== null, // Disable if cell is occupied
    });

    const style = {
        boxShadow: isOver
            ? "inset 0 0 0 2px #4F8EF7" // Creates an inset border effect
            : undefined,
        borderRadius: isOver ? "8px" : "0", // Rounded edges when isOver is true
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                position: "relative",
                width: size,
                height: size,
                userSelect: "none",

                ...style,
            }}
            className={`${getEnhancementClass(enhancement)}`}
        >
            {getEnchancementLetter(enhancement, size)}
            {cell && cell.type === BoardTileType.TILE && (
                <motion.div
                    initial={
                        (cell.tile as Tile).placed && !initialRender
                            ? { scale: 0, opacity: 0 }
                            : { scale: 1, opacity: 1 }
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                >
                    <TileView tile={cell.tile as Tile} size={60} />
                </motion.div>
            )}
        </div>
    );

    //     if (cell.type === "blocked") {
    //     return <div>Blocked</div>;
    // }
};

export default memo(BoardCell, (prevProps, nextProps) => prevProps.cell === nextProps.cell);
