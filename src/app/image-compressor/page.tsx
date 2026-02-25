"use client";
import { useState, useCallback } from "react";
import type { Metadata } from "next";

/**
 * 图片压缩工具 — 纯浏览器端
 * 使用 Canvas API 对图片进行有损压缩
 */
export default function ImageCompressorPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState(0.7);
    const [results, setResults] = useState<
        { name: string; original: number; compressed: number; url: string }[]
    >([]);
    const [processing, setProcessing] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
        );
        setFiles((prev) => [...prev, ...dropped]);
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const selected = Array.from(e.target.files).filter((f) =>
                    f.type.startsWith("image/")
                );
                setFiles((prev) => [...prev, ...selected]);
            }
        },
        []
    );

    const removeFile = useCallback((index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    /** 压缩单个图片到指定质量 */
    const compressImage = (file: File, quality: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("Canvas not supported"));
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Compression failed"));
                    },
                    "image/jpeg",
                    quality
                );
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = URL.createObjectURL(file);
        });
    };

    const handleCompress = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setResults([]);
        const newResults: typeof results = [];
        for (const file of files) {
            try {
                const blob = await compressImage(file, quality);
                const url = URL.createObjectURL(blob);
                newResults.push({
                    name: file.name,
                    original: file.size,
                    compressed: blob.size,
                    url,
                });
            } catch {
                // NOTE: 跳过无法处理的文件
            }
        }
        setResults(newResults);
        setProcessing(false);
    };

    const downloadFile = (url: string, name: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `compressed_${name.replace(/\.[^.]+$/, "")}.jpg`;
        a.click();
    };

    const downloadAll = () => {
        results.forEach((r) => downloadFile(r.url, r.name));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const totalSaved = results.reduce(
        (sum, r) => sum + (r.original - r.compressed),
        0
    );

    return (
        <div className="tool-page">
            <h1>Image Compressor</h1>
            <p className="tool-description">
                Compress images to reduce file size while maintaining quality. Everything
                runs in your browser — your images never leave your device.
            </p>

            {/* 拖拽上传区域 */}
            <div
                className={`dropzone ${files.length > 0 ? "" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
            >
                <div className="dropzone-icon">📦</div>
                <p className="dropzone-text">
                    <strong>Click to upload</strong> or drag &amp; drop images here
                </p>
                <p className="dropzone-text" style={{ fontSize: "0.8125rem", marginTop: 4 }}>
                    Supports JPG, PNG, WebP, BMP
                </p>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                />
            </div>

            {/* 已选文件列表 */}
            {files.length > 0 && (
                <div className="file-list">
                    {files.map((file, i) => (
                        <div className="file-item" key={`${file.name}-${i}`}>
                            <div className="file-item-info">
                                <span className="file-item-name">{file.name}</span>
                                <span className="file-item-size">{formatSize(file.size)}</span>
                            </div>
                            <button className="file-item-remove" onClick={() => removeFile(i)}>
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 质量控制 */}
            {files.length > 0 && (
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        style={{ width: "100%", marginTop: 8 }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        <span>Smaller file</span>
                        <span>Better quality</span>
                    </div>
                </div>
            )}

            {/* 操作按钮 */}
            {files.length > 0 && (
                <div className="actions-bar">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleCompress}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner" /> Compressing...
                            </>
                        ) : (
                            `Compress ${files.length} image${files.length > 1 ? "s" : ""}`
                        )}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setFiles([]);
                            setResults([]);
                        }}
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* 结果面板 */}
            {results.length > 0 && (
                <div className="result-panel">
                    <h3>✅ Compression Results</h3>
                    <div className="result-stats">
                        <div className="stat-item">
                            <div className="stat-label">Files</div>
                            <div className="stat-value">{results.length}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Total Saved</div>
                            <div className="stat-value success">{formatSize(totalSaved)}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Avg. Reduction</div>
                            <div className="stat-value success">
                                {Math.round(
                                    (totalSaved /
                                        results.reduce((sum, r) => sum + r.original, 0)) *
                                    100
                                )}
                                %
                            </div>
                        </div>
                    </div>
                    <div className="file-list">
                        {results.map((r, i) => (
                            <div className="file-item" key={i}>
                                <div className="file-item-info">
                                    <span className="file-item-name">{r.name}</span>
                                    <span className="file-item-size">
                                        {formatSize(r.original)} → {formatSize(r.compressed)} (
                                        {Math.round((1 - r.compressed / r.original) * 100)}% saved)
                                    </span>
                                </div>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                                    onClick={() => downloadFile(r.url, r.name)}
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                    {results.length > 1 && (
                        <div className="actions-bar">
                            <button className="btn btn-success" onClick={downloadAll}>
                                Download All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
