import { Tile, Enchantment } from "shared/types/tiles";
import { Card } from "@/components/ui/card";

interface TileViewProps {
    tile: Tile;
    size?: number;
}

// ...existing code...
function getEnchantmentClass(enchantment: Enchantment) {
    switch (enchantment) {
        case Enchantment.FOIL:
            return "tile-foil";
        case Enchantment.HOLOGRAPHIC:
            return "tile-holo";
        case Enchantment.POLYCHROME:
            return "tile-poly";
        case Enchantment.NEGATIVE:
            return "tile-negative";
        default:
            return "tile-default";
    }
}

export default function TileView({ tile, size = 48 }: TileViewProps) {
    const edition =
        tile.enchantment === Enchantment.FOIL
            ? "Foil Edition"
            : tile.enchantment === Enchantment.HOLOGRAPHIC
            ? "Holographic Edition"
            : tile.enchantment === Enchantment.POLYCHROME
            ? "Polychrome Edition"
            : tile.enchantment === Enchantment.NEGATIVE
            ? "Negative Edition"
            : "Standard Edition";

    return (
        <div
            style={{
                position: "relative",
                width: size,
                height: size,
                userSelect: "none", // Prevent text selection
                borderRadius: size * 0.18,
            }}
            className={`${getEnchantmentClass(tile.enchantment)}`}
            title={edition} // Tooltip on hover
        >
            <h2
                style={{
                    position: "absolute",
                    top: 2,
                    right: 5,
                    margin: 0,
                    fontSize: size * 0.3,
                }}
            >
                {tile.points}
            </h2>

            <h1
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: size * 0.6,
                }}
            >
                {tile.letter}
            </h1>
        </div>
    );
}
