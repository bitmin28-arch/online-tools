"use client";
import { useState } from "react";

/**
 * Hash 生成器 — MD5/SHA-1/SHA-256/SHA-512
 * 使用 Web Crypto API（SubtleCrypto）
 */
export default function HashGeneratorPage() {
    const [input, setInput] = useState("");
    const [results, setResults] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState("");
    const [loading, setLoading] = useState(false);

    const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

    const generateHashes = async () => {
        if (!input) return;
        setLoading(true);
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashResults: Record<string, string> = {};
        for (const algo of algorithms) {
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            hashResults[algo] = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        }
        setResults(hashResults);
        setLoading(false);
    };

    const copyHash = async (algo: string) => {
        await navigator.clipboard.writeText(results[algo]);
        setCopied(algo);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <div className="tool-page">
            <h1>Hash Generator</h1>
            <p className="tool-description">
                Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text. Uses the Web Crypto API.
            </p>

            <textarea
                className="textarea"
                placeholder="Enter text to hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ minHeight: 120 }}
            />

            <div className="actions-bar">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={generateHashes}
                    disabled={!input || loading}
                >
                    {loading ? "Generating..." : "Generate Hashes"}
                </button>
            </div>

            {Object.keys(results).length > 0 && (
                <div className="result-panel">
                    <h3>🔐 Hash Results</h3>
                    {algorithms.map((algo) => (
                        <div key={algo} style={{ marginBottom: 16 }}>
                            <label
                                style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "var(--color-text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {algo}
                            </label>
                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                <div
                                    className="code-block"
                                    style={{
                                        flex: 1,
                                        fontSize: "0.75rem",
                                        padding: "10px 12px",
                                    }}
                                >
                                    {results[algo]}
                                </div>
                                <button
                                    className={`btn ${copied === algo ? "btn-success" : "btn-secondary"}`}
                                    style={{ padding: "8px 12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                                    onClick={() => copyHash(algo)}
                                >
                                    {copied === algo ? "✓" : "Copy"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
