import { useGameStore } from "@/utils/game/[id]/store";
import TileRack from "@/components/game/[id]/game/TileRack";
// import ThemeToggle from "@/components/ThemeToggle";
import Board from "@/components/game/[id]/game/Board";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function GamePage() {
    // const hand = useGameStore((state) => state.hand);
    const numRows = useGameStore((state) => state.numRows);
    const numCols = useGameStore((state) => state.numCols);

    return (
        <div>
            <div
                style={{
                    height: "100vh",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <TransformWrapper
                    minScale={0.5}
                    maxScale={2}
                    wheel={{ step: 4.2 }}
                    limitToBounds={false}

                    // looks like this does not work rn https://github.com/BetterTyped/react-zoom-pan-pinch/issues/478
                    // use limitToBounds={false} for now
                    // minPositionX={0}
                    // maxPositionX={0}
                    // minPositionY={0}
                    // maxPositionY={0}
                    initialScale={1}
                    initialPositionX={window.innerWidth / 2 - (numCols * 64) / 2}
                    initialPositionY={window.innerHeight / 2 - (numRows * 64) / 2}
                >
                    <TransformComponent>
                        <Board />
                    </TransformComponent>
                </TransformWrapper>
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: "auto",
                    }}
                >
                    <TileRack />
                </div>
            </div>
        </div>
    );
}
