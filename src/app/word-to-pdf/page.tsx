"use client";
import { useState, useCallback } from "react";

/**
 * Word 转 PDF 工具
 * 使用 mammoth.js 将 .docx 转为 HTML，再通过浏览器打印为 PDF
 */
export default function WordToPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [html, setHtml] = useState("");
    const [converting, setConverting] = useState(false);
    const [error, setError] = useState("");

    const handleFile = useCallback(async (f: File) => {
        setFile(f);
        setHtml("");
        setError("");
        setConverting(true);
        try {
            const mammoth = await import("mammoth");
            const arrayBuffer = await f.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            if (result.value) {
                setHtml(result.value);
            } else {
                setError("Failed to extract content from the document.");
            }
            if (result.messages.length > 0) {
                console.warn("mammoth warnings:", result.messages);
            }
        } catch {
            setError("Failed to read the Word document. Make sure it's a valid .docx file.");
        }
        setConverting(false);
    }, []);

    const downloadPdf = () => {
        if (!html) return;
        // NOTE: 使用浏览器原生打印功能生成 PDF — 这是纯浏览器端最可靠的方式
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("Please allow pop-ups to download the PDF.");
            return;
        }
        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${file?.name?.replace(/\.docx?$/i, "") || "Document"}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #222;
          }
          h1 { font-size: 24px; margin-top: 24px; }
          h2 { font-size: 20px; margin-top: 20px; }
          h3 { font-size: 16px; margin-top: 16px; }
          p { margin: 8px 0; }
          table { border-collapse: collapse; width: 100%; margin: 12px 0; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
          th { background: #f5f5f5; }
          img { max-width: 100%; height: auto; }
          ul, ol { padding-left: 24px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
        printWindow.document.close();
        // HACK: 需要等图片加载完再打印
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    return (
        <div className="tool-page">
            <h1>Word to PDF</h1>
            <p className="tool-description">
                Convert .docx files to PDF right in your browser. Upload a Word document, preview it, then save as PDF.
            </p>

            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f?.name.endsWith(".docx")) handleFile(f);
                    else setError("Please upload a .docx file");
                }}
                onClick={() => document.getElementById("docx-input")?.click()}
            >
                {converting ? (
                    <><span className="spinner" style={{ width: 24, height: 24 }} /> <p>Converting...</p></>
                ) : (
                    <>
                        <div className="dropzone-icon">📝</div>
                        <p className="dropzone-text">
                            {file ? file.name : <><strong>Click to upload</strong> or drag &amp; drop a .docx file</>}
                        </p>
                    </>
                )}
                <input
                    id="docx-input"
                    type="file"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                    }}
                />
            </div>

            {error && (
                <div className="result-panel" style={{ borderColor: "var(--color-error)" }}>
                    <p style={{ color: "var(--color-error)" }}>❌ {error}</p>
                </div>
            )}

            {html && (
                <>
                    <div className="actions-bar">
                        <button className="btn btn-primary btn-lg" onClick={downloadPdf}>📥 Save as PDF</button>
                        <button className="btn btn-secondary" onClick={() => { setFile(null); setHtml(""); }}>Clear</button>
                    </div>

                    <div className="result-panel">
                        <h3>📄 Preview</h3>
                        <div
                            style={{
                                background: "white",
                                color: "#222",
                                padding: "32px 24px",
                                borderRadius: "var(--radius-sm)",
                                maxHeight: 600,
                                overflow: "auto",
                                lineHeight: 1.6,
                                fontSize: "0.875rem",
                            }}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
