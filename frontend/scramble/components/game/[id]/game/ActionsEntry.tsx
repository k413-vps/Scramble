import { useState } from "react";
import { Action } from "shared/types/actions";
import { CheckCircle, XCircle, Shuffle, Edit, Flame } from "lucide-react";

interface ActionsEntryProps {
    action: Action;
    disabled: boolean;
    onClick: () => void;
}

export default function ActionsEntry({ action, disabled, onClick }: ActionsEntryProps) {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

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
                onClick={onClick}
                disabled={disabled}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    marginBottom: "8px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    backgroundColor: disabled ? "var(--color-disabled)" : "var(--color-card)",
                    color: disabled ? "var(--color-disabled-foreground)" : "var(--color-card-foreground)",
                    cursor: disabled ? "not-allowed" : "pointer",
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
