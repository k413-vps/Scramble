import { useGameStore } from "@/utils/game/[id]/store";
import TileRack from "@/components/game/[id]/game/TileRack";
import ThemeToggle from "@/components/ThemeToggle";

export default function GamePage() {
    const hand = useGameStore((state) => state.hand);

    return (
        <div>
            <ThemeToggle />
            <h1>Game Page</h1>
            <TileRack tiles={hand} />
        </div>
    );
}
