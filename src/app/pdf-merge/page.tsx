"use client";
import { useState, useCallback } from "react";

/**
 * PDF 合并工具 — 使用 pdf-lib 在浏览器端合并多个 PDF
 */
export default function PdfMergePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files).filter(
            (f) => f.type === "application/pdf"
        );
        setFiles((prev) => [...prev, ...dropped]);
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const selected = Array.from(e.target.files).filter(
                    (f) => f.type === "application/pdf"
                );
                setFiles((prev) => [...prev, ...selected]);
            }
        },
        []
    );

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    /** 上移文件 */
    const moveUp = (index: number) => {
        if (index === 0) return;
        setFiles((prev) => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });
    };

    /** 下移文件 */
    const moveDown = (index: number) => {
        setFiles((prev) => {
            if (index >= prev.length - 1) return prev;
            const next = [...prev];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setProcessing(true);
        try {
            // NOTE: 动态导入避免 SSR 问题
            const { PDFDocument } = await import("pdf-lib");
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const bytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Failed to merge PDFs. Please make sure all files are valid PDFs.");
        }
        setProcessing(false);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="tool-page">
            <h1>PDF Merge</h1>
            <p className="tool-description">
                Combine multiple PDF files into a single document. Drag to reorder.
                Everything runs in your browser.
            </p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("pdf-input")?.click()}
            >
                <div className="dropzone-icon">📑</div>
                <p className="dropzone-text">
                    <strong>Click to upload</strong> or drag &amp; drop PDF files
                </p>
                <input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                />
            </div>

            {files.length > 0 && (
                <>
                    <div className="file-list">
                        {files.map((file, i) => (
                            <div className="file-item" key={`${file.name}-${i}`}>
                                <div className="file-item-info">
                                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", width: 24 }}>
                                        {i + 1}.
                                    </span>
                                    <span className="file-item-name">{file.name}</span>
                                    <span className="file-item-size">{formatSize(file.size)}</span>
                                </div>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <button
                                        className="file-item-remove"
                                        onClick={() => moveUp(i)}
                                        style={{ fontSize: "0.875rem" }}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="file-item-remove"
                                        onClick={() => moveDown(i)}
                                        style={{ fontSize: "0.875rem" }}
                                    >
                                        ↓
                                    </button>
                                    <button className="file-item-remove" onClick={() => removeFile(i)}>
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="actions-bar">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={mergePdfs}
                            disabled={files.length < 2 || processing}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner" /> Merging...
                                </>
                            ) : (
                                `Merge ${files.length} PDFs`
                            )}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setFiles([])}
                        >
                            Clear All
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
