"use client";
import { useState, useCallback } from "react";

/**
 * 图片格式转换工具 — JPG/PNG/WebP/BMP 互转
 */
export default function ImageConverterPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/png");
    const [results, setResults] = useState<{ name: string; url: string; size: number }[]>([]);
    const [processing, setProcessing] = useState(false);

    const formatMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        setFiles((prev) => [...prev, ...dropped]);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selected = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
            setFiles((prev) => [...prev, ...selected]);
        }
    }, []);

    const convertImages = async () => {
        setProcessing(true);
        setResults([]);
        const newResults: typeof results = [];
        for (const file of files) {
            const img = new Image();
            const url = URL.createObjectURL(file);
            await new Promise<void>((resolve) => {
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext("2d")!;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resultUrl = URL.createObjectURL(blob);
                            const ext = formatMap[format];
                            newResults.push({
                                name: file.name.replace(/\.[^.]+$/, `.${ext}`),
                                url: resultUrl,
                                size: blob.size,
                            });
                        }
                        resolve();
                    }, format, format === "image/jpeg" ? 0.92 : undefined);
                };
                img.src = url;
            });
        }
        setResults(newResults);
        setProcessing(false);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="tool-page">
            <h1>Image Converter</h1>
            <p className="tool-description">
                Convert images between JPG, PNG, and WebP formats. Runs entirely in your browser.
            </p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("conv-input")?.click()}
            >
                <div className="dropzone-icon">🔄</div>
                <p className="dropzone-text">
                    <strong>Click to upload</strong> or drag &amp; drop images
                </p>
                <input id="conv-input" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileSelect} />
            </div>

            {files.length > 0 && (
                <>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 8, display: "block" }}>
                            Convert to:
                        </label>
                        <div className="toggle-group">
                            {(["image/jpeg", "image/png", "image/webp"] as const).map((f) => (
                                <button
                                    key={f}
                                    className={`toggle-btn ${format === f ? "active" : ""}`}
                                    onClick={() => setFormat(f)}
                                >
                                    {formatMap[f].toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="file-list">
                        {files.map((file, i) => (
                            <div className="file-item" key={`${file.name}-${i}`}>
                                <div className="file-item-info">
                                    <span className="file-item-name">{file.name}</span>
                                    <span className="file-item-size">{formatSize(file.size)}</span>
                                </div>
                                <button className="file-item-remove" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}>×</button>
                            </div>
                        ))}
                    </div>

                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={convertImages} disabled={processing}>
                            {processing ? (<><span className="spinner" /> Converting...</>) : `Convert ${files.length} image${files.length > 1 ? "s" : ""}`}
                        </button>
                        <button className="btn btn-secondary" onClick={() => { setFiles([]); setResults([]); }}>Clear</button>
                    </div>
                </>
            )}

            {results.length > 0 && (
                <div className="result-panel">
                    <h3>✅ Converted Files</h3>
                    <div className="file-list">
                        {results.map((r, i) => (
                            <div className="file-item" key={i}>
                                <div className="file-item-info">
                                    <span className="file-item-name">{r.name}</span>
                                    <span className="file-item-size">{formatSize(r.size)}</span>
                                </div>
                                <a href={r.url} download={r.name} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
