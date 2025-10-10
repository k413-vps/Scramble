import { CSSProperties } from "react";


type ScorePillProps = {
    points: number;
    mana: number;
};

export default function ScorePill(
    { points, mana }: ScorePillProps
) {


    const containerStyle: CSSProperties = {
        // position: "fixed",
        // left: "50%",
        // top: 50,
        // transform: "translateX(-50%)",
        color: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        pointerEvents: "none",
    };

    const pillStyle: CSSProperties = {
        display: "flex",
        alignItems: "baseline",
        gap: 6,
        background: "rgba(255,255,255,0.08)",
        padding: "6px 10px",
        borderRadius: 999,
    };

    const labelStyle: CSSProperties = {
        fontSize: 12,
        opacity: 0.85,
    };

    const valueStyle: CSSProperties = {
        fontSize: 16,
        fontWeight: 700,
    };

    const dividerStyle: CSSProperties = {
        width: 1,
        height: 18,
        background: "rgba(255,255,255,0.15)",
    };

    return (
        <div style={containerStyle} role="status" aria-live="polite">
            <div style={pillStyle}>
                <span style={labelStyle}>Points</span>
                <span style={valueStyle}>{points}</span>
            </div>
            <div style={dividerStyle} />
            <div style={pillStyle}>
                <span style={labelStyle}>Mana</span>
                <span style={valueStyle}>{mana}</span>
            </div>
        </div>
    );
}
