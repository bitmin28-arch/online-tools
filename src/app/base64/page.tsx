"use client";
import { useState, useCallback } from "react";

/**
 * Base64 编解码工具
 * 支持文本和文件的 Base64 编解码
 */
export default function Base64Page() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const processText = useCallback(() => {
        setError("");
        try {
            if (mode === "encode") {
                // NOTE: 使用 TextEncoder 处理 Unicode 字符
                const encoder = new TextEncoder();
                const bytes = encoder.encode(input);
                const binary = Array.from(bytes)
                    .map((b) => String.fromCharCode(b))
                    .join("");
                setOutput(btoa(binary));
            } else {
                const binary = atob(input.trim());
                const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
                const decoder = new TextDecoder();
                setOutput(decoder.decode(bytes));
            }
        } catch {
            setError(
                mode === "decode" ? "Invalid Base64 string" : "Encoding failed"
            );
            setOutput("");
        }
    }, [input, mode]);

    const copyOutput = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swap = () => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
        setOutput("");
        setError("");
    };

    return (
        <div className="tool-page">
            <h1>Base64 Encoder / Decoder</h1>
            <p className="tool-description">
                Encode text to Base64 or decode Base64 back to plain text.
            </p>

            <div className="actions-bar" style={{ marginBottom: 16 }}>
                <div className="toggle-group">
                    <button
                        className={`toggle-btn ${mode === "encode" ? "active" : ""}`}
                        onClick={() => {
                            setMode("encode");
                            setOutput("");
                            setError("");
                        }}
                    >
                        Encode
                    </button>
                    <button
                        className={`toggle-btn ${mode === "decode" ? "active" : ""}`}
                        onClick={() => {
                            setMode("decode");
                            setOutput("");
                            setError("");
                        }}
                    >
                        Decode
                    </button>
                </div>
                <button className="btn btn-primary" onClick={processText}>
                    {mode === "encode" ? "Encode →" : "← Decode"}
                </button>
                <button className="btn btn-secondary" onClick={swap}>
                    ⇄ Swap
                </button>
            </div>

            <div className="split-layout">
                <div className="split-panel">
                    <label>{mode === "encode" ? "Plain Text" : "Base64 String"}</label>
                    <textarea
                        className="textarea"
                        placeholder={
                            mode === "encode"
                                ? "Enter text to encode..."
                                : "Paste Base64 string to decode..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ minHeight: 300 }}
                    />
                </div>
                <div className="split-panel" style={{ position: "relative" }}>
                    <label>{mode === "encode" ? "Base64 Output" : "Decoded Text"}</label>
                    {output && (
                        <button
                            className={`copy-btn ${copied ? "copied" : ""}`}
                            onClick={copyOutput}
                            style={{ top: 32, right: 0 }}
                        >
                            {copied ? "✓ Copied" : "Copy"}
                        </button>
                    )}
                    {error ? (
                        <div
                            className="code-block"
                            style={{ color: "var(--color-error)", minHeight: 300 }}
                        >
                            ❌ {error}
                        </div>
                    ) : (
                        <div className="code-block" style={{ minHeight: 300 }}>
                            {output || "Result will appear here..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
