"use client";
import { useState } from "react";

/**
 * 大小写转换工具 — 多种格式转换
 */
export default function CaseConverterPage() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState("");

    const conversions = [
        { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
        { label: "lowercase", fn: (s: string) => s.toLowerCase() },
        {
            label: "Title Case",
            fn: (s: string) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()),
        },
        {
            label: "Sentence case",
            fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
        },
        {
            label: "camelCase",
            fn: (s: string) => {
                const words = s.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
                return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
            },
        },
        {
            label: "PascalCase",
            fn: (s: string) => {
                const words = s.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
                return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
            },
        },
        {
            label: "snake_case",
            fn: (s: string) => s.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_").toLowerCase(),
        },
        {
            label: "kebab-case",
            fn: (s: string) => s.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-").toLowerCase(),
        },
        {
            label: "CONSTANT_CASE",
            fn: (s: string) => s.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_").toUpperCase(),
        },
        {
            label: "aLtErNaTiNg",
            fn: (s: string) => s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
        },
    ];

    const copy = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <div className="tool-page">
            <h1>Case Converter</h1>
            <p className="tool-description">Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.</p>

            <textarea
                className="textarea"
                placeholder="Type or paste your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ minHeight: 120 }}
            />

            {input && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
                    {conversions.map((conv) => {
                        const result = conv.fn(input);
                        return (
                            <div className="file-item" key={conv.label}>
                                <div className="file-item-info" style={{ flex: 1 }}>
                                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", width: 110, minWidth: 110 }}>
                                        {conv.label}
                                    </span>
                                    <span className="file-item-name" style={{ fontFamily: "monospace", fontSize: "0.8125rem", wordBreak: "break-all" }}>
                                        {result}
                                    </span>
                                </div>
                                <button
                                    className={`btn ${copied === conv.label ? "btn-success" : "btn-secondary"}`}
                                    style={{ padding: "4px 10px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                                    onClick={() => copy(result, conv.label)}
                                >
                                    {copied === conv.label ? "✓" : "Copy"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
