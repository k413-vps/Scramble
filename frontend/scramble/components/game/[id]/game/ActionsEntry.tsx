import { useState } from "react";
import { Action } from "shared/types/actions";
import { CheckCircle, XCircle, Shuffle, Edit, Flame } from "lucide-react";

interface ActionsEntryProps {
    action: Action;
    index: number;
    mana: number;
}

export default function ActionsEntry({ action, mana }: ActionsEntryProps) {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const isDisabled = mana < action.cost;

    // Map action types to icons
    const getIcon = (type: string) => {
        switch (type) {
            case "PLAY":
                return <CheckCircle size={20} />;
            case "PASS":
                return <XCircle size={20} />;
            case "SHUFFLE":
                return <Shuffle size={20} />;
            case "WRITE":
                return <Edit size={20} />;
            case "SACRIFICE":
                return <Flame size={20} />;
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
                        console.log(`Action selected: ${action.type}`);
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
                    {getIcon(action.type)}
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>{action.type}</span>
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
                    {action.description}
                </div>
            )}
        </div>
    );
}
