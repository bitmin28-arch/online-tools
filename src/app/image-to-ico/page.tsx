"use client";
import { useState, useCallback } from "react";

/**
 * 图片转 ICO 工具 — 将任意图片转为 favicon 用的 ICO 格式
 * NOTE: 浏览器不支持真正的 ICO 编码，这里生成多尺寸 PNG favicon
 */
const ICO_SIZES = [16, 32, 48, 64, 128, 256];

export default function ImageToIcoPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48]);
    const [results, setResults] = useState<{ size: number; url: string }[]>([]);

    const handleFile = useCallback((f: File) => {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResults([]);
    }, []);

    const toggleSize = (size: number) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
        );
    };

    const convert = async () => {
        if (!file) return;
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => { img.onload = resolve; });

        const newResults: typeof results = [];
        for (const size of selectedSizes) {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, size, size);
            const url = canvas.toDataURL("image/png");
            newResults.push({ size, url });
        }
        setResults(newResults);
    };

    const download = (url: string, size: number) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `favicon-${size}x${size}.png`;
        a.click();
    };

    return (
        <div className="tool-page">
            <h1>Image to ICO</h1>
            <p className="tool-description">Convert any image to favicon-sized PNG icons for your website.</p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f); }}
                onClick={() => document.getElementById("ico-input")?.click()}
            >
                {preview ? (
                    <img src={preview} alt="Preview" style={{ maxHeight: 160, margin: "0 auto", borderRadius: "var(--radius-sm)" }} />
                ) : (
                    <>
                        <div className="dropzone-icon">🌐</div>
                        <p className="dropzone-text"><strong>Click to upload</strong> or drag &amp; drop an image</p>
                    </>
                )}
                <input id="ico-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>

            {file && (
                <div className="result-panel">
                    <h3>📏 Select Sizes</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {ICO_SIZES.map((size) => (
                            <label
                                key={size}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                                    background: selectedSizes.includes(size) ? "rgba(99,102,241,0.1)" : "var(--color-bg-secondary)",
                                    border: `1px solid ${selectedSizes.includes(size) ? "var(--color-accent)" : "var(--color-border)"}`,
                                    borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.875rem",
                                }}
                            >
                                <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => toggleSize(size)} />
                                {size}×{size}
                            </label>
                        ))}
                    </div>
                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={convert} disabled={selectedSizes.length === 0}>
                            Generate Icons
                        </button>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="result-panel">
                    <h3>✅ Generated Icons</h3>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "end" }}>
                        {results.map((r) => (
                            <div key={r.size} style={{ textAlign: "center" }}>
                                <img
                                    src={r.url} alt={`${r.size}x${r.size}`}
                                    style={{ width: Math.max(r.size, 32), height: Math.max(r.size, 32), border: "1px solid var(--color-border)", borderRadius: 4, imageRendering: r.size <= 32 ? "pixelated" : "auto" }}
                                />
                                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 4 }}>{r.size}px</p>
                                <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.6875rem", marginTop: 4 }} onClick={() => download(r.url, r.size)}>
                                    Save
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
