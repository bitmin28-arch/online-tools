"use client";
import { useState } from "react";

/**
 * URL 编解码工具
 */
export default function UrlCodecPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const process = () => {
        setError("");
        try {
            if (mode === "encode") {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch {
            setError(mode === "decode" ? "Invalid URL-encoded string" : "Encoding failed");
            setOutput("");
        }
    };

    const copy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-page">
            <h1>URL Encoder / Decoder</h1>
            <p className="tool-description">Encode or decode URL components for web development.</p>

            <div className="actions-bar" style={{ marginBottom: 16 }}>
                <div className="toggle-group">
                    <button className={`toggle-btn ${mode === "encode" ? "active" : ""}`} onClick={() => { setMode("encode"); setOutput(""); setError(""); }}>Encode</button>
                    <button className={`toggle-btn ${mode === "decode" ? "active" : ""}`} onClick={() => { setMode("decode"); setOutput(""); setError(""); }}>Decode</button>
                </div>
                <button className="btn btn-primary" onClick={process}>{mode === "encode" ? "Encode →" : "← Decode"}</button>
            </div>

            <div className="split-layout">
                <div className="split-panel">
                    <label>{mode === "encode" ? "Plain Text / URL" : "Encoded String"}</label>
                    <textarea className="textarea" placeholder={mode === "encode" ? "Enter URL or text to encode..." : "Paste encoded string..."} value={input} onChange={(e) => setInput(e.target.value)} style={{ minHeight: 250 }} />
                </div>
                <div className="split-panel" style={{ position: "relative" }}>
                    <label>{mode === "encode" ? "Encoded Output" : "Decoded Output"}</label>
                    {output && <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy} style={{ top: 32, right: 0 }}>{copied ? "✓ Copied" : "Copy"}</button>}
                    {error ? (
                        <div className="code-block" style={{ color: "var(--color-error)", minHeight: 250 }}>❌ {error}</div>
                    ) : (
                        <div className="code-block" style={{ minHeight: 250 }}>{output || "Result will appear here..."}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
