import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Spell } from "shared/types/spells";
import { Brush, Shield, Zap, Hand, Image, Layers, Eye, Star, WandSparkles, Volleyball, Repeat } from "lucide-react";

interface ActionsEntryProps {
    spell: Spell;
    index: number;
    mana: number;
}

export default function ActionsEntry({ spell, mana }: ActionsEntryProps) {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);
    const isDisabled = mana < spell.cost;

    useEffect(() => {
        if (isTooltipVisible && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setTooltipPos({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2,
            });
        }
    }, [isTooltipVisible]);

    useEffect(() => {
        return () => {
            if (tooltipTimeout.current) {
                clearTimeout(tooltipTimeout.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        tooltipTimeout.current = setTimeout(() => {
            setTooltipVisible(true);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (tooltipTimeout.current) {
            clearTimeout(tooltipTimeout.current);
        }
        setTooltipVisible(false);
    };

    // Map spell types to icons
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                ref={buttonRef}
                onClick={() => {
                    if (!isDisabled) {
                        // handle spell click
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
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{spell.cost}</span>
            </button>
            {isTooltipVisible &&
                tooltipPos.top !== 0 &&
                tooltipPos.left !== 0 &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            top: tooltipPos.top,
                            left: tooltipPos.left,
                            transform: "translateX(-50%)",
                            padding: "8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            backgroundColor: "rgba(0, 0, 0)",
                            color: "var(--color-tooltip-foreground)",
                            zIndex: 9999,
                            pointerEvents: "none",
                        }}
                    >
                        {spell.description}
                    </div>,
                    document.body
                )}
        </div>
    );
}
