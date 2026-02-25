"use client";
import { useState } from "react";

/**
 * CSS 渐变生成器
 * 支持线性渐变和径向渐变，实时预览，一键复制 CSS 代码
 */
export default function GradientGeneratorPage() {
    const [type, setType] = useState<"linear" | "radial">("linear");
    const [angle, setAngle] = useState(135);
    const [color1, setColor1] = useState("#6366f1");
    const [color2, setColor2] = useState("#a855f7");
    const [color3, setColor3] = useState("");
    const [copied, setCopied] = useState(false);

    const colors = [color1, color2, color3].filter(Boolean).join(", ");
    const gradientCss =
        type === "linear"
            ? `linear-gradient(${angle}deg, ${colors})`
            : `radial-gradient(circle, ${colors})`;

    const fullCss = `background: ${gradientCss};`;

    const copy = async () => {
        await navigator.clipboard.writeText(fullCss);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const presets = [
        { c1: "#667eea", c2: "#764ba2" },
        { c1: "#f093fb", c2: "#f5576c" },
        { c1: "#4facfe", c2: "#00f2fe" },
        { c1: "#43e97b", c2: "#38f9d7" },
        { c1: "#fa709a", c2: "#fee140" },
        { c1: "#a18cd1", c2: "#fbc2eb" },
        { c1: "#fccb90", c2: "#d57eeb" },
        { c1: "#e0c3fc", c2: "#8ec5fc" },
    ];

    return (
        <div className="tool-page">
            <h1>Gradient Generator</h1>
            <p className="tool-description">
                Create beautiful CSS gradients with a visual editor. Copy the CSS code with one click.
            </p>

            {/* 预览 */}
            <div
                style={{
                    width: "100%",
                    height: 200,
                    borderRadius: "var(--radius-lg)",
                    background: gradientCss,
                    border: "1px solid var(--color-border)",
                    marginBottom: 24,
                }}
            />

            {/* CSS 代码 */}
            <div style={{ position: "relative" }}>
                <div className="code-block" style={{ paddingRight: 80 }}>
                    {fullCss}
                </div>
                <button
                    className={`copy-btn ${copied ? "copied" : ""}`}
                    onClick={copy}
                >
                    {copied ? "✓ Copied" : "Copy CSS"}
                </button>
            </div>

            {/* 控制面板 */}
            <div className="result-panel">
                <h3>⚙️ Settings</h3>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: 8, display: "block" }}>Type</label>
                    <div className="toggle-group">
                        <button className={`toggle-btn ${type === "linear" ? "active" : ""}`} onClick={() => setType("linear")}>Linear</button>
                        <button className={`toggle-btn ${type === "radial" ? "active" : ""}`} onClick={() => setType("radial")}>Radial</button>
                    </div>
                </div>

                {type === "linear" && (
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Angle: {angle}°</label>
                        <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
                    </div>
                )}

                <div className="color-inputs">
                    <div className="color-input-group">
                        <label>Color 1</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: 40, height: 32, border: "none", cursor: "pointer" }} />
                            <input className="input" value={color1} onChange={(e) => setColor1(e.target.value)} />
                        </div>
                    </div>
                    <div className="color-input-group">
                        <label>Color 2</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: 40, height: 32, border: "none", cursor: "pointer" }} />
                            <input className="input" value={color2} onChange={(e) => setColor2(e.target.value)} />
                        </div>
                    </div>
                    <div className="color-input-group">
                        <label>Color 3 (Optional)</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input type="color" value={color3 || "#000000"} onChange={(e) => setColor3(e.target.value)} style={{ width: 40, height: 32, border: "none", cursor: "pointer" }} />
                            <input className="input" value={color3} onChange={(e) => setColor3(e.target.value)} placeholder="Optional..." />
                            {color3 && <button className="btn btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setColor3("")}>×</button>}
                        </div>
                    </div>
                </div>
            </div>

            {/* 预设 */}
            <div className="result-panel">
                <h3>🎨 Presets</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {presets.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => { setColor1(p.c1); setColor2(p.c2); setColor3(""); }}
                            style={{
                                height: 48,
                                borderRadius: "var(--radius-sm)",
                                background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`,
                                border: "1px solid var(--color-border)",
                                cursor: "pointer",
                                transition: "transform var(--transition-fast)",
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
