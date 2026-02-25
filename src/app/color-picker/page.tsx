"use client";
import { useState, useCallback } from "react";

/**
 * 颜色选择器 — HEX/RGB/HSL 互转
 */

/** 将 HEX 转换为 RGB */
function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
}

/** 将 RGB 转换为 HEX */
function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/** 将 RGB 转换为 HSL */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** 将 HSL 转换为 RGB */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360; s /= 100; l /= 100;
    let r: number, g: number, b: number;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default function ColorPickerPage() {
    const [hex, setHex] = useState("#6366f1");
    const [copied, setCopied] = useState("");

    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(...rgb);

    const updateFromHex = (val: string) => {
        if (/^#[0-9a-fA-F]{6}$/.test(val)) setHex(val);
        else if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setHex(val);
    };

    const updateFromRgb = (r: number, g: number, b: number) => {
        setHex(rgbToHex(
            Math.min(255, Math.max(0, r)),
            Math.min(255, Math.max(0, g)),
            Math.min(255, Math.max(0, b))
        ));
    };

    const updateFromHsl = (h: number, s: number, l: number) => {
        const [r, g, b] = hslToRgb(h, s, l);
        setHex(rgbToHex(r, g, b));
    };

    const copyValue = async (val: string, label: string) => {
        await navigator.clipboard.writeText(val);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    const hexStr = hex.length === 7 ? hex : "#000000";
    const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const hslStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

    return (
        <div className="tool-page">
            <h1>Color Picker</h1>
            <p className="tool-description">
                Pick a color and convert between HEX, RGB, and HSL formats.
            </p>

            {/* 颜色预览 */}
            <div
                className="color-preview"
                style={{ background: hexStr, height: 160, marginBottom: 24 }}
            />

            {/* 原生颜色选择器 */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
                <input
                    type="color"
                    value={hexStr}
                    onChange={(e) => setHex(e.target.value)}
                    style={{
                        width: 60,
                        height: 44,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "var(--radius-sm)",
                    }}
                />
                <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                    Click to pick a color
                </span>
            </div>

            {/* 各格式输入 */}
            <div className="color-inputs">
                {/* HEX */}
                <div className="color-input-group">
                    <label>HEX</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input
                            className="input"
                            value={hex}
                            onChange={(e) => updateFromHex(e.target.value)}
                        />
                        <button
                            className={`btn ${copied === "hex" ? "btn-success" : "btn-secondary"}`}
                            style={{ padding: "8px 12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => copyValue(hexStr, "hex")}
                        >
                            {copied === "hex" ? "✓" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* RGB */}
                <div className="color-input-group">
                    <label>RGB</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input
                            className="input"
                            value={rgbStr}
                            readOnly
                        />
                        <button
                            className={`btn ${copied === "rgb" ? "btn-success" : "btn-secondary"}`}
                            style={{ padding: "8px 12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => copyValue(rgbStr, "rgb")}
                        >
                            {copied === "rgb" ? "✓" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* HSL */}
                <div className="color-input-group">
                    <label>HSL</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input
                            className="input"
                            value={hslStr}
                            readOnly
                        />
                        <button
                            className={`btn ${copied === "hsl" ? "btn-success" : "btn-secondary"}`}
                            style={{ padding: "8px 12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => copyValue(hslStr, "hsl")}
                        >
                            {copied === "hsl" ? "✓" : "Copy"}
                        </button>
                    </div>
                </div>
            </div>

            {/* RGB 滑块 */}
            <div className="result-panel">
                <h3>🎚️ RGB Sliders</h3>
                {(["R", "G", "B"] as const).map((ch, i) => (
                    <div key={ch} style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                            {ch}: {rgb[i]}
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={255}
                            value={rgb[i]}
                            onChange={(e) => {
                                const newRgb: [number, number, number] = [...rgb];
                                newRgb[i] = Number(e.target.value);
                                updateFromRgb(...newRgb);
                            }}
                            style={{
                                width: "100%",
                                accentColor: ch === "R" ? "#ef4444" : ch === "G" ? "#22c55e" : "#3b82f6",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
