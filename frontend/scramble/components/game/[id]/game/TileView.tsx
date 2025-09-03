import { Tile, Enchantment } from "shared/types/tiles";

interface TileViewProps {
    tile: Tile;
    size?: number;
}

export default function TileView({ tile, size = 48 }: TileViewProps) {
    return (
        <div
            className="relative m-1 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.6,
                userSelect: "none",
            }}
        >
            {/* Letter */}
            <span
                className="absolute inset-0 flex items-center justify-center font-bold text-gray-900 dark:text-gray-100"
                style={{
                    top: -size * 0.08, // Move letter higher
                }}
            >
                {tile.letter}
            </span>
            {/* Points */}
            <span
                className="absolute right-2 dark:text-gray-300"
                style={{
                    top: size * 0.01, // Move points higher
                    right: size * 0.08,
                    fontSize: size * 0.25,
                    color: "var(--tw-text-gray-700)", // Tailwind color for light mode
                }}
            >
                {tile.points}
            </span>
        </div>
    );
}
