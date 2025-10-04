import { DragDataTile, DragTypes } from "@/lib/dragTypes";
import { useDraggable } from "@dnd-kit/core";
import { Tile, Enchantment } from "shared/types/tiles";

interface TileViewProps {
    tile: Tile;
    size?: number;
    index?: number | null;
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
const animationDelay = `${Math.random() * -12}s`;

export default function TileView({ tile, size = 48, index = null }: TileViewProps) {
    console.log("Rendering TileView for tile:", tile, "at index:", index);
    const dragData: DragDataTile = {
        dragType: DragTypes.TILE,
        dragIndex: index,
        tile: tile,
    };

    const tooltip =
        tile.enchantment === Enchantment.FOIL
            ? "Foil " + tile.letter
            : tile.enchantment === Enchantment.HOLOGRAPHIC
            ? "Holographic " + tile.letter
            : tile.enchantment === Enchantment.POLYCHROME
            ? "Polychrome " + tile.letter
            : tile.enchantment === Enchantment.NEGATIVE
            ? "Negative " + tile.letter
            : "Standard " + tile.letter;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: "tile" + tile.id,
        data: dragData,
    });
    const style = transform
        ? {
            //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: 1000,
          }
        : undefined;

    return (
        <div
            style={{
                position: "relative",
                width: size,
                height: size,
                userSelect: "none", // Prevent text selection
                borderRadius: size * 0.18,
                animationDelay,
                border: `${size * 0.04}px solid var(--foreground)`,
                ...style,
            }}
            className={`${getEnchantmentClass(tile.enchantment)}`}
            title={tooltip} // Tooltip on hover
            ref={setNodeRef}
            {...listeners}
            {...attributes}
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
