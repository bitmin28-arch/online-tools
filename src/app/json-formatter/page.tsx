"use client";
import { useState, useCallback } from "react";

/**
 * JSON 格式化/校验工具
 * 支持格式化、压缩、校验 JSON 数据
 */
export default function JsonFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [indent, setIndent] = useState(2);
    const [copied, setCopied] = useState(false);

    const formatJson = useCallback(() => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, indent));
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    }, [input, indent]);

    const minifyJson = useCallback(() => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    }, [input]);

    const copyOutput = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const loadSample = () => {
        setInput(
            JSON.stringify(
                {
                    name: "TurnTurnTurn",
                    version: "1.0.0",
                    tools: ["image-compressor", "json-formatter", "qr-generator"],
                    config: { theme: "dark", language: "en" },
                },
                null,
                2
            )
        );
    };

    return (
        <div className="tool-page">
            <h1>JSON Formatter</h1>
            <p className="tool-description">
                Format, validate, and minify JSON data. Paste your JSON below to get started.
            </p>

            <div className="actions-bar" style={{ marginBottom: 16 }}>
                <button className="btn btn-primary" onClick={formatJson}>
                    Format
                </button>
                <button className="btn btn-secondary" onClick={minifyJson}>
                    Minify
                </button>
                <button className="btn btn-secondary" onClick={loadSample}>
                    Load Sample
                </button>
                <div className="toggle-group" style={{ marginLeft: "auto" }}>
                    {[2, 4].map((n) => (
                        <button
                            key={n}
                            className={`toggle-btn ${indent === n ? "active" : ""}`}
                            onClick={() => setIndent(n)}
                        >
                            {n} spaces
                        </button>
                    ))}
                    <button
                        className={`toggle-btn ${indent === 0 ? "active" : ""}`}
                        onClick={() => setIndent(0)}
                    >
                        Tab
                    </button>
                </div>
            </div>

            <div className="split-layout">
                <div className="split-panel">
                    <label>Input</label>
                    <textarea
                        className="textarea"
                        placeholder="Paste your JSON here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ minHeight: 400 }}
                    />
                </div>
                <div className="split-panel" style={{ position: "relative" }}>
                    <label>Output</label>
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
                            style={{ color: "var(--color-error)", minHeight: 400 }}
                        >
                            ❌ {error}
                        </div>
                    ) : (
                        <div className="code-block" style={{ minHeight: 400 }}>
                            {output || "Formatted JSON will appear here..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
