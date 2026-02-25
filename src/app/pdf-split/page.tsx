"use client";
import { useState, useCallback } from "react";

/**
 * PDF 拆分工具 — 使用 pdf-lib 提取指定页面
 */
export default function PdfSplitPage() {
    const [file, setFile] = useState<File | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [rangeInput, setRangeInput] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleFile = useCallback(async (f: File) => {
        setFile(f);
        setError("");
        try {
            const { PDFDocument } = await import("pdf-lib");
            const bytes = await f.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const count = pdf.getPageCount();
            setTotalPages(count);
            setRangeInput(`1-${count}`);
        } catch {
            setError("Failed to load PDF file.");
        }
    }, []);

    /** 解析页码范围字符串，例如 "1-3, 5, 7-9" */
    const parseRange = (input: string, max: number): number[] => {
        const pages = new Set<number>();
        const parts = input.split(",").map((s) => s.trim());
        for (const part of parts) {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
                        pages.add(i - 1); // 0-indexed
                    }
                }
            } else {
                const n = Number(part);
                if (!isNaN(n) && n >= 1 && n <= max) pages.add(n - 1);
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    };

    const splitPdf = async () => {
        if (!file || !rangeInput) return;
        setProcessing(true);
        setError("");
        try {
            const { PDFDocument } = await import("pdf-lib");
            const bytes = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(bytes);
            const pageIndices = parseRange(rangeInput, totalPages);
            if (pageIndices.length === 0) {
                setError("No valid pages selected.");
                setProcessing(false);
                return;
            }
            const newPdf = await PDFDocument.create();
            const pages = await newPdf.copyPages(srcPdf, pageIndices);
            pages.forEach((page) => newPdf.addPage(page));
            const resultBytes = await newPdf.save();
            const blob = new Blob([new Uint8Array(resultBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `split_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            setError("Failed to split PDF.");
        }
        setProcessing(false);
    };

    return (
        <div className="tool-page">
            <h1>PDF Split</h1>
            <p className="tool-description">Extract specific pages from a PDF file. Enter page ranges like &quot;1-3, 5, 7-9&quot;.</p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") handleFile(f); }}
                onClick={() => document.getElementById("split-input")?.click()}
            >
                <div className="dropzone-icon">✂️</div>
                <p className="dropzone-text">
                    {file ? `${file.name} (${totalPages} pages)` : <><strong>Click to upload</strong> or drag &amp; drop a PDF</>}
                </p>
                <input id="split-input" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>

            {file && totalPages > 0 && (
                <div className="result-panel">
                    <h3>📄 Select Pages</h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: 12 }}>
                        Total pages: {totalPages}. Use format: 1-3, 5, 7-9
                    </p>
                    <input className="input" value={rangeInput} onChange={(e) => setRangeInput(e.target.value)} placeholder="e.g. 1-3, 5, 7-9" />
                    {error && <p style={{ color: "var(--color-error)", fontSize: "0.875rem", marginTop: 8 }}>❌ {error}</p>}
                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={splitPdf} disabled={processing}>
                            {processing ? (<><span className="spinner" /> Splitting...</>) : "Extract Pages"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
