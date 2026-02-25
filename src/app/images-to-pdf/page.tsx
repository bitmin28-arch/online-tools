"use client";
import { useState, useCallback } from "react";

/**
 * 图片转 PDF — 将多张图片合并为一个 PDF
 */
export default function ImagesToPdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

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

    const moveUp = (i: number) => {
        if (i === 0) return;
        setFiles((prev) => { const n = [...prev];[n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; });
    };

    const moveDown = (i: number) => {
        setFiles((prev) => { if (i >= prev.length - 1) return prev; const n = [...prev];[n[i], n[i + 1]] = [n[i + 1], n[i]]; return n; });
    };

    const convertToPdf = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const bytes = await file.arrayBuffer();
                let image;
                if (file.type === "image/png") {
                    image = await pdfDoc.embedPng(bytes);
                } else {
                    // NOTE: pdf-lib 只支持 PNG 和 JPG，其他格式先用 canvas 转为 PNG
                    if (file.type === "image/jpeg" || file.type === "image/jpg") {
                        image = await pdfDoc.embedJpg(bytes);
                    } else {
                        const pngBytes = await convertToFormat(file, "image/png");
                        image = await pdfDoc.embedPng(pngBytes);
                    }
                }
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            }

            const resultBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(resultBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "images.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Failed to create PDF. Please try again.");
        }
        setProcessing(false);
    };

    /** 将任意格式图片用 Canvas 转为指定格式 */
    const convertToFormat = (file: File, mime: string): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                canvas.getContext("2d")!.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) blob.arrayBuffer().then(resolve).catch(reject);
                    else reject(new Error("Conversion failed"));
                }, mime);
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = URL.createObjectURL(file);
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="tool-page">
            <h1>Images to PDF</h1>
            <p className="tool-description">Combine multiple images into a single PDF document. Drag to reorder.</p>

            <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => document.getElementById("i2p-input")?.click()}>
                <div className="dropzone-icon">🖼️</div>
                <p className="dropzone-text"><strong>Click to upload</strong> or drag &amp; drop images</p>
                <input id="i2p-input" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileSelect} />
            </div>

            {files.length > 0 && (
                <>
                    <div className="file-list">
                        {files.map((file, i) => (
                            <div className="file-item" key={`${file.name}-${i}`}>
                                <div className="file-item-info">
                                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", width: 24 }}>{i + 1}.</span>
                                    <span className="file-item-name">{file.name}</span>
                                    <span className="file-item-size">{formatSize(file.size)}</span>
                                </div>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <button className="file-item-remove" onClick={() => moveUp(i)} style={{ fontSize: "0.875rem" }}>↑</button>
                                    <button className="file-item-remove" onClick={() => moveDown(i)} style={{ fontSize: "0.875rem" }}>↓</button>
                                    <button className="file-item-remove" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}>×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={convertToPdf} disabled={processing}>
                            {processing ? (<><span className="spinner" /> Creating PDF...</>) : `Create PDF from ${files.length} image${files.length > 1 ? "s" : ""}`}
                        </button>
                        <button className="btn btn-secondary" onClick={() => setFiles([])}>Clear All</button>
                    </div>
                </>
            )}
        </div>
    );
}
