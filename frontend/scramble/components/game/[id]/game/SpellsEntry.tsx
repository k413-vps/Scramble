import { useState } from "react";
import { Spell } from "shared/types/spells";
import { Brush, Shield, Zap, Hand, Image, Layers, Eye, Star, WandSparkles , Volleyball, Repeat } from "lucide-react";

interface ActionsEntryProps {
    spell: Spell;
    index: number;
    mana: number;
}

export default function ActionsEntry({ spell, index, mana }: ActionsEntryProps) {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const isDisabled = mana < spell.cost;

    // Map action types to icons
    const getIcon = (type: string) => {
        switch (type) {
            case "PaintBrush":
                return <Brush />;
            case "Block":
                return <Shield />;
            case "Curse":
                return <Zap />;
            case "Grabber":
                return <Hand />;
            case "Pictograph":
                return <Image />;
            case "Petroglyph":
                return <Layers />;
            case "Hieroglyph":
                return <Eye />;
            case "Hone":
                return <Star />;
            case "Manifest":
                return <WandSparkles />;
            case "CrystalBall":
                return <Volleyball />;
            case "Swap":
                return <Repeat />;
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "300px",
            }}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
        >
            <button
                onClick={() => {
                    if (!isDisabled) {
                        console.log(`Action selected: ${spell.type}`);
                    }
                }}
                disabled={isDisabled}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    marginBottom: "8px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    backgroundColor: isDisabled ? "var(--color-disabled)" : "var(--color-card)",
                    color: isDisabled ? "var(--color-disabled-foreground)" : "var(--color-card-foreground)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {getIcon(spell.type)}
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>{spell.type}</span>
                </div>
            </button>
            {isTooltipVisible && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "var(--color-tooltip-background)",
                        color: "var(--color-tooltip-foreground)",
                        zIndex: 10,
                    }}
                >
                    {spell.description}
                </div>
            )}
        </div>
    );
}
