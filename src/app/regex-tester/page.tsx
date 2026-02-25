"use client";
import { useState, useMemo } from "react";

/**
 * 正则表达式测试工具 — 实时匹配高亮
 */
export default function RegexTesterPage() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("g");
    const [testString, setTestString] = useState("");
    const [error, setError] = useState("");

    const matches = useMemo(() => {
        if (!pattern || !testString) return [];
        try {
            const regex = new RegExp(pattern, flags);
            setError("");
            const results: { index: number; match: string; groups?: Record<string, string> }[] = [];
            let m;
            // NOTE: 需要防止无限循环（空匹配的情况）
            const maxIter = 1000;
            let iter = 0;
            if (flags.includes("g")) {
                while ((m = regex.exec(testString)) !== null && iter++ < maxIter) {
                    results.push({ index: m.index, match: m[0], groups: m.groups });
                    if (m[0] === "") regex.lastIndex++;
                }
            } else {
                m = regex.exec(testString);
                if (m) results.push({ index: m.index, match: m[0], groups: m.groups });
            }
            return results;
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid regex");
            return [];
        }
    }, [pattern, flags, testString]);

    const toggleFlag = (flag: string) => {
        setFlags((prev) => prev.includes(flag) ? prev.replace(flag, "") : prev + flag);
    };

    /** 高亮匹配部分 */
    const highlightedText = useMemo(() => {
        if (!pattern || !testString || matches.length === 0) return null;
        const parts: { text: string; isMatch: boolean }[] = [];
        let lastIndex = 0;
        for (const m of matches) {
            if (m.index > lastIndex) {
                parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
            }
            parts.push({ text: m.match, isMatch: true });
            lastIndex = m.index + m.match.length;
        }
        if (lastIndex < testString.length) {
            parts.push({ text: testString.slice(lastIndex), isMatch: false });
        }
        return parts;
    }, [testString, matches, pattern]);

    return (
        <div className="tool-page">
            <h1>Regex Tester</h1>
            <p className="tool-description">Test and debug regular expressions with real-time matching and highlighting.</p>

            {/* 正则输入 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ color: "var(--color-text-muted)", fontSize: "1.25rem" }}>/</span>
                <input className="input" style={{ flex: 1, fontFamily: "monospace" }} placeholder="Enter regex pattern..." value={pattern} onChange={(e) => setPattern(e.target.value)} />
                <span style={{ color: "var(--color-text-muted)", fontSize: "1.25rem" }}>/</span>
                <input className="input" style={{ width: 60, fontFamily: "monospace", textAlign: "center" }} value={flags} onChange={(e) => setFlags(e.target.value)} />
            </div>

            {/* Flags 快捷切换 */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[
                    { flag: "g", label: "Global" },
                    { flag: "i", label: "Case Insensitive" },
                    { flag: "m", label: "Multiline" },
                    { flag: "s", label: "Dotall" },
                ].map((f) => (
                    <button
                        key={f.flag}
                        className={`toggle-btn ${flags.includes(f.flag) ? "active" : ""}`}
                        onClick={() => toggleFlag(f.flag)}
                        style={{
                            padding: "6px 12px", fontSize: "0.8125rem", borderRadius: "var(--radius-sm)",
                            background: flags.includes(f.flag) ? "var(--color-accent)" : "var(--color-bg-secondary)",
                            color: flags.includes(f.flag) ? "white" : "var(--color-text-secondary)",
                            border: `1px solid ${flags.includes(f.flag) ? "var(--color-accent)" : "var(--color-border)"}`,
                            cursor: "pointer",
                        }}
                    >
                        {f.flag} - {f.label}
                    </button>
                ))}
            </div>

            {error && <p style={{ color: "var(--color-error)", fontSize: "0.875rem", marginBottom: 12 }}>❌ {error}</p>}

            {/* 测试文本 */}
            <textarea className="textarea" placeholder="Enter test string..." value={testString} onChange={(e) => setTestString(e.target.value)} style={{ minHeight: 160 }} />

            {/* 高亮结果 */}
            {highlightedText && (
                <div className="result-panel">
                    <h3>🎯 Highlighted Matches ({matches.length})</h3>
                    <div className="code-block" style={{ whiteSpace: "pre-wrap" }}>
                        {highlightedText.map((part, i) =>
                            part.isMatch ? (
                                <mark key={i} style={{ background: "rgba(99,102,241,0.35)", color: "white", borderRadius: 2, padding: "1px 2px" }}>
                                    {part.text}
                                </mark>
                            ) : (
                                <span key={i}>{part.text}</span>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* 匹配详情 */}
            {matches.length > 0 && (
                <div className="result-panel">
                    <h3>📋 Match Details ({matches.length} match{matches.length > 1 ? "es" : ""})</h3>
                    <div className="file-list">
                        {matches.slice(0, 50).map((m, i) => (
                            <div className="file-item" key={i}>
                                <div className="file-item-info">
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", width: 30 }}>#{i + 1}</span>
                                    <span className="file-item-name" style={{ fontFamily: "monospace" }}>&quot;{m.match}&quot;</span>
                                    <span className="file-item-size">at index {m.index}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
