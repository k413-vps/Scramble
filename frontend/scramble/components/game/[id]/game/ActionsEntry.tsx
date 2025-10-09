import { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Action } from "shared/types/actions";
import { CheckCircle, XCircle, Shuffle, Edit, Flame } from "lucide-react";

interface ActionsEntryProps {
    action: Action;
    disabled: boolean;
    onClick: () => void;
    children?: ReactNode;
}

export default function ActionsEntry({ action, disabled, onClick, children }: ActionsEntryProps) {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isTooltipVisible && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setTooltipPos({
                top: rect.bottom + 8, // 8px below the button
                left: rect.left + rect.width / 2, // centered horizontally
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
        }, 1000); // 1 second delay
    };

    const handleMouseLeave = () => {
        if (tooltipTimeout.current) {
            clearTimeout(tooltipTimeout.current);
        }
        setTooltipVisible(false);
    };

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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                ref={buttonRef}
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
                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                    {children}
                </div>
            </button>
            {isTooltipVisible && tooltipPos.top !== 0 && tooltipPos.left !== 0 &&
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
                        {action.description}
                    </div>,
                    document.body
                )}
        </div>
    );
}
