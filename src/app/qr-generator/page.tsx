"use client";
import { useState, useRef, useEffect } from "react";

/**
 * 二维码生成工具
 * 使用 qrcode 库在 Canvas 上绘制二维码
 */
export default function QrGeneratorPage() {
    const [text, setText] = useState("");
    const [size, setSize] = useState(256);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [fgColor, setFgColor] = useState("#000000");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [generated, setGenerated] = useState(false);

    const generateQr = async () => {
        if (!text.trim() || !canvasRef.current) return;
        // NOTE: 动态导入 qrcode 库，避免 SSR 问题
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
        });
        setGenerated(true);
    };

    const downloadQr = () => {
        if (!canvasRef.current) return;
        const a = document.createElement("a");
        a.href = canvasRef.current.toDataURL("image/png");
        a.download = "qrcode.png";
        a.click();
    };

    // 实时生成（有内容时自动更新）
    useEffect(() => {
        if (text.trim()) {
            const timer = setTimeout(generateQr, 300);
            return () => clearTimeout(timer);
        } else {
            setGenerated(false);
        }
    }, [text, size, bgColor, fgColor]);

    return (
        <div className="tool-page">
            <h1>QR Code Generator</h1>
            <p className="tool-description">
                Generate QR codes from text, URLs, or any data. Customize colors and size.
            </p>

            <div className="split-layout">
                <div className="split-panel">
                    <label>Content</label>
                    <textarea
                        className="textarea"
                        placeholder="Enter text or URL to encode..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ minHeight: 160 }}
                    />

                    <label style={{ marginTop: 16 }}>Size: {size}px</label>
                    <input
                        type="range"
                        min={128}
                        max={512}
                        step={32}
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        style={{ width: "100%" }}
                    />

                    <div className="color-inputs" style={{ marginTop: 16 }}>
                        <div className="color-input-group">
                            <label>Foreground</label>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    style={{ width: 40, height: 32, border: "none", cursor: "pointer" }}
                                />
                                <input
                                    className="input"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>
                        <div className="color-input-group">
                            <label>Background</label>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    style={{ width: 40, height: 32, border: "none", cursor: "pointer" }}
                                />
                                <input
                                    className="input"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="split-panel"
                    style={{ alignItems: "center", justifyContent: "center" }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            borderRadius: "var(--radius-md)",
                            display: generated ? "block" : "none",
                        }}
                    />
                    {!generated && (
                        <div
                            style={{
                                width: size,
                                height: size,
                                background: "var(--color-bg-secondary)",
                                borderRadius: "var(--radius-md)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--color-text-muted)",
                                fontSize: "0.875rem",
                            }}
                        >
                            QR code preview
                        </div>
                    )}
                    {generated && (
                        <button
                            className="btn btn-primary"
                            onClick={downloadQr}
                            style={{ marginTop: 16 }}
                        >
                            Download PNG
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
