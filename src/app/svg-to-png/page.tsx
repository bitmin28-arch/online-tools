"use client";
import { useState, useCallback, useRef } from "react";

/**
 * SVG 转 PNG 工具 — Canvas 渲染 SVG 并导出为 PNG
 */
export default function SvgToPngPage() {
    const [svgContent, setSvgContent] = useState("");
    const [scale, setScale] = useState(2);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [transparent, setTransparent] = useState(true);
    const [result, setResult] = useState("");
    const [resultSize, setResultSize] = useState({ w: 0, h: 0 });

    const handleFile = useCallback((f: File) => {
        const reader = new FileReader();
        reader.onload = () => setSvgContent(reader.result as string);
        reader.readAsText(f);
    }, []);

    const convert = () => {
        if (!svgContent.trim()) return;

        // NOTE: 解析 SVG 获取原始尺寸
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        if (!svgEl) { alert("Invalid SVG content"); return; }

        let w = parseFloat(svgEl.getAttribute("width") || "0");
        let h = parseFloat(svgEl.getAttribute("height") || "0");
        if (!w || !h) {
            const vb = svgEl.getAttribute("viewBox")?.split(/[\s,]+/).map(Number);
            if (vb && vb.length === 4) { w = vb[2]; h = vb[3]; }
        }
        if (!w || !h) { w = 300; h = 150; }

        const canvas = document.createElement("canvas");
        canvas.width = w * scale;
        canvas.height = h * scale;
        const ctx = canvas.getContext("2d")!;

        if (!transparent) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const img = new Image();
        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL("image/png");
            setResult(pngUrl);
            setResultSize({ w: canvas.width, h: canvas.height });
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    const download = () => {
        if (!result) return;
        const a = document.createElement("a");
        a.href = result;
        a.download = `converted_${resultSize.w}x${resultSize.h}.png`;
        a.click();
    };

    return (
        <div className="tool-page">
            <h1>SVG to PNG</h1>
            <p className="tool-description">Convert SVG files or code to high-resolution PNG images.</p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.name.endsWith(".svg")) handleFile(f); }}
                onClick={() => document.getElementById("svg-upload")?.click()}
            >
                <div className="dropzone-icon">🎨</div>
                <p className="dropzone-text"><strong>Click to upload</strong> or drag &amp; drop an SVG file</p>
                <input id="svg-upload" type="file" accept=".svg" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>

            <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8125rem", margin: "8px 0" }}>— or paste SVG code —</p>

            <textarea className="textarea" placeholder="<svg>...</svg>" value={svgContent} onChange={(e) => setSvgContent(e.target.value)} style={{ minHeight: 150 }} />

            {svgContent && (
                <div className="result-panel">
                    <h3>⚙️ Settings</h3>
                    <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                            <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Scale: {scale}x</label>
                            <input type="range" min={1} max={8} value={scale} onChange={(e) => setScale(Number(e.target.value))} style={{ width: 150 }} />
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", cursor: "pointer" }}>
                            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} /> Transparent background
                        </label>
                        {!transparent && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <label style={{ fontSize: "0.8125rem" }}>BG Color:</label>
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                            </div>
                        )}
                    </div>
                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={convert}>Convert to PNG</button>
                    </div>
                </div>
            )}

            {result && (
                <div className="result-panel">
                    <h3>✅ Result ({resultSize.w} × {resultSize.h}px)</h3>
                    <div style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px", borderRadius: "var(--radius-sm)", padding: 16, textAlign: "center" }}>
                        <img src={result} alt="Converted PNG" style={{ maxWidth: "100%", maxHeight: 400 }} />
                    </div>
                    <div className="actions-bar">
                        <button className="btn btn-success" onClick={download}>Download PNG</button>
                    </div>
                </div>
            )}
        </div>
    );
}
