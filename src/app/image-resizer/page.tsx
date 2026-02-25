"use client";
import { useState, useCallback, useRef } from "react";

/**
 * 图片调大小工具 — 按精确尺寸或百分比缩放
 */
export default function ImageResizerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [keepRatio, setKeepRatio] = useState(true);
    const [mode, setMode] = useState<"pixels" | "percent">("pixels");
    const [percent, setPercent] = useState(50);
    const [result, setResult] = useState("");

    const handleFile = useCallback((f: File) => {
        const img = new Image();
        img.onload = () => {
            setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight });
            setWidth(img.naturalWidth);
            setHeight(img.naturalHeight);
            setPreview(img.src);
        };
        img.src = URL.createObjectURL(f);
        setFile(f);
        setResult("");
    }, []);

    const updateWidth = (w: number) => {
        setWidth(w);
        if (keepRatio && originalSize.w > 0) {
            setHeight(Math.round((w / originalSize.w) * originalSize.h));
        }
    };

    const updateHeight = (h: number) => {
        setHeight(h);
        if (keepRatio && originalSize.h > 0) {
            setWidth(Math.round((h / originalSize.h) * originalSize.w));
        }
    };

    const resize = () => {
        if (!file) return;
        const img = new Image();
        img.onload = () => {
            const targetW = mode === "percent" ? Math.round(originalSize.w * percent / 100) : width;
            const targetH = mode === "percent" ? Math.round(originalSize.h * percent / 100) : height;
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const url = canvas.toDataURL(file.type || "image/png");
            setResult(url);
        };
        img.src = URL.createObjectURL(file);
    };

    const download = () => {
        if (!result) return;
        const a = document.createElement("a");
        a.href = result;
        a.download = `resized_${file?.name || "image.png"}`;
        a.click();
    };

    return (
        <div className="tool-page">
            <h1>Image Resizer</h1>
            <p className="tool-description">Resize images to exact dimensions or by percentage.</p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f); }}
                onClick={() => document.getElementById("resize-input")?.click()}
            >
                {preview ? (
                    <img src={preview} alt="Preview" style={{ maxHeight: 200, margin: "0 auto", borderRadius: "var(--radius-sm)" }} />
                ) : (
                    <>
                        <div className="dropzone-icon">📐</div>
                        <p className="dropzone-text"><strong>Click to upload</strong> or drag &amp; drop an image</p>
                    </>
                )}
                <input id="resize-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>

            {file && (
                <div className="result-panel">
                    <h3>⚙️ Resize Options</h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: 16 }}>
                        Original: {originalSize.w} × {originalSize.h}px
                    </p>
                    <div className="toggle-group" style={{ marginBottom: 16 }}>
                        <button className={`toggle-btn ${mode === "pixels" ? "active" : ""}`} onClick={() => setMode("pixels")}>By Pixels</button>
                        <button className={`toggle-btn ${mode === "percent" ? "active" : ""}`} onClick={() => setMode("percent")}>By Percentage</button>
                    </div>

                    {mode === "pixels" ? (
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)" }}>WIDTH</label>
                                <input className="input" type="number" value={width} onChange={(e) => updateWidth(Number(e.target.value))} style={{ width: 120 }} />
                            </div>
                            <span style={{ color: "var(--color-text-muted)", marginTop: 16 }}>×</span>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)" }}>HEIGHT</label>
                                <input className="input" type="number" value={height} onChange={(e) => updateHeight(Number(e.target.value))} style={{ width: 120 }} />
                            </div>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: "0.875rem", cursor: "pointer" }}>
                                <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} /> Keep aspect ratio
                            </label>
                        </div>
                    ) : (
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Scale: {percent}%</label>
                            <input type="range" min={1} max={200} value={percent} onChange={(e) => setPercent(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
                            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                                Output: {Math.round(originalSize.w * percent / 100)} × {Math.round(originalSize.h * percent / 100)}px
                            </p>
                        </div>
                    )}

                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={resize}>Resize</button>
                    </div>
                </div>
            )}

            {result && (
                <div className="result-panel">
                    <h3>✅ Result</h3>
                    <img src={result} alt="Resized" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: "var(--radius-sm)" }} />
                    <div className="actions-bar">
                        <button className="btn btn-success" onClick={download}>Download</button>
                    </div>
                </div>
            )}
        </div>
    );
}
