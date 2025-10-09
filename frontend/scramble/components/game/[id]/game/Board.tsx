import { useGameStore } from "@/utils/game/[id]/store";
import BoardTileView from "./BoardTileView";

export default function Board() {
    const board = useGameStore((state) => state.board);
    const enhancements = useGameStore((state) => state.enhancements);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateRows: `repeat(${board.length}, 1fr)`,
                width: "100vw",
            }}
        >
            {board.map((row, rowIdx) => (
                <div key={rowIdx} style={{ display: "flex" }}>
                    {row.map((cell, colIdx) => (
                        <BoardTileView
                            key={colIdx}
                            cell={cell}
                            enhancement={enhancements[rowIdx][colIdx]}
                            rowNum={rowIdx}
                            colNum={colIdx}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
