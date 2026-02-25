"use client";
import { useState } from "react";

/**
 * CSS Box Shadow 生成器 — 可视化编辑器
 */
export default function BoxShadowPage() {
    const [horizontal, setHorizontal] = useState(4);
    const [vertical, setVertical] = useState(4);
    const [blur, setBlur] = useState(16);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState("#000000");
    const [opacity, setOpacity] = useState(30);
    const [inset, setInset] = useState(false);
    const [copied, setCopied] = useState(false);

    const shadowColor = (() => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    })();

    const shadowCss = `${inset ? "inset " : ""}${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColor}`;
    const fullCss = `box-shadow: ${shadowCss};`;

    const copy = async () => {
        await navigator.clipboard.writeText(fullCss);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sliders = [
        { label: "Horizontal", value: horizontal, set: setHorizontal, min: -50, max: 50, unit: "px" },
        { label: "Vertical", value: vertical, set: setVertical, min: -50, max: 50, unit: "px" },
        { label: "Blur", value: blur, set: setBlur, min: 0, max: 100, unit: "px" },
        { label: "Spread", value: spread, set: setSpread, min: -50, max: 50, unit: "px" },
        { label: "Opacity", value: opacity, set: setOpacity, min: 0, max: 100, unit: "%" },
    ];

    return (
        <div className="tool-page">
            <h1>Box Shadow Generator</h1>
            <p className="tool-description">Design CSS box shadows with a visual editor. Adjust and copy the CSS code.</p>

            {/* 预览区域 */}
            <div style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                height: 250, background: "var(--color-bg-secondary)", borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)", marginBottom: 24,
            }}>
                <div style={{
                    width: 150, height: 150, background: "var(--color-bg-card)",
                    borderRadius: "var(--radius-md)", boxShadow: shadowCss,
                }} />
            </div>

            {/* CSS 代码 */}
            <div style={{ position: "relative" }}>
                <div className="code-block" style={{ paddingRight: 100 }}>{fullCss}</div>
                <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
                    {copied ? "✓ Copied" : "Copy CSS"}
                </button>
            </div>

            {/* 控制面板 */}
            <div className="result-panel">
                <h3>⚙️ Settings</h3>
                {sliders.map((s) => (
                    <div key={s.label} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                            <label style={{ fontWeight: 600 }}>{s.label}</label>
                            <span style={{ color: "var(--color-text-muted)" }}>{s.value}{s.unit}</span>
                        </div>
                        <input type="range" min={s.min} max={s.max} value={s.value} onChange={(e) => s.set(Number(e.target.value))} style={{ width: "100%", marginTop: 4 }} />
                    </div>
                ))}

                <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12 }}>
                    <div className="color-input-group">
                        <label>Shadow Color</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 40, height: 32, border: "none", cursor: "pointer" }} />
                            <input className="input" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 100 }} />
                        </div>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", cursor: "pointer", marginTop: 20 }}>
                        <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} /> Inset
                    </label>
                </div>
            </div>
        </div>
    );
}
