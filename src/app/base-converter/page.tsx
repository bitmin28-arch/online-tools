"use client";
import { useState } from "react";

/**
 * 进制转换工具 — 二进制/八进制/十进制/十六进制互转
 */
export default function BaseConverterPage() {
    const [input, setInput] = useState("");
    const [fromBase, setFromBase] = useState(10);
    const [copied, setCopied] = useState("");

    const bases = [
        { value: 2, label: "Binary (2)" },
        { value: 8, label: "Octal (8)" },
        { value: 10, label: "Decimal (10)" },
        { value: 16, label: "Hexadecimal (16)" },
    ];

    const parsedValue = (() => {
        if (!input.trim()) return NaN;
        try {
            return parseInt(input.trim(), fromBase);
        } catch {
            return NaN;
        }
    })();

    const isValid = !isNaN(parsedValue);

    const conversions = bases.map((base) => ({
        ...base,
        result: isValid ? parsedValue.toString(base.value).toUpperCase() : "—",
    }));

    const copy = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    const presets = [
        { label: "255", value: "255", base: 10 },
        { label: "0xFF", value: "FF", base: 16 },
        { label: "11111111", value: "11111111", base: 2 },
        { label: "377", value: "377", base: 8 },
    ];

    return (
        <div className="tool-page">
            <h1>Number Base Converter</h1>
            <p className="tool-description">Convert numbers between binary, octal, decimal, and hexadecimal.</p>

            <div className="result-panel" style={{ marginTop: 0 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 6 }}>Input Number</label>
                        <input className="input" style={{ fontFamily: "monospace", fontSize: "1rem" }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a number..." />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 6 }}>From Base</label>
                        <div className="toggle-group">
                            {bases.map((b) => (
                                <button key={b.value} className={`toggle-btn ${fromBase === b.value ? "active" : ""}`} onClick={() => setFromBase(b.value)}>
                                    {b.value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    {presets.map((p) => (
                        <button key={p.label} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => { setInput(p.value); setFromBase(p.base); }}>
                            {p.label}
                        </button>
                    ))}
                </div>

                {input && !isValid && (
                    <p style={{ color: "var(--color-error)", fontSize: "0.875rem", marginTop: 12 }}>
                        ❌ Invalid number for base {fromBase}
                    </p>
                )}
            </div>

            {isValid && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                    {conversions.map((conv) => (
                        <div
                            className="file-item"
                            key={conv.value}
                            style={{
                                borderColor: conv.value === fromBase ? "var(--color-accent)" : "var(--color-border)",
                                background: conv.value === fromBase ? "rgba(99,102,241,0.05)" : "var(--color-bg-secondary)",
                            }}
                        >
                            <div className="file-item-info">
                                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", width: 120, minWidth: 120 }}>
                                    {conv.label}
                                </span>
                                <span className="file-item-name" style={{ fontFamily: "monospace", fontSize: "1rem", letterSpacing: "0.05em" }}>
                                    {conv.result}
                                </span>
                            </div>
                            <button
                                className={`btn ${copied === conv.label ? "btn-success" : "btn-secondary"}`}
                                style={{ padding: "4px 10px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                                onClick={() => copy(conv.result, conv.label)}
                            >
                                {copied === conv.label ? "✓" : "Copy"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isValid && (
                <div className="result-panel">
                    <h3>📊 Bit Info</h3>
                    <div className="result-stats">
                        <div className="stat-item">
                            <div className="stat-label">Decimal Value</div>
                            <div className="stat-value">{parsedValue.toLocaleString()}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Bit Length</div>
                            <div className="stat-value">{parsedValue.toString(2).length}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Is Power of 2</div>
                            <div className="stat-value">{parsedValue > 0 && (parsedValue & (parsedValue - 1)) === 0 ? "✅ Yes" : "❌ No"}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
