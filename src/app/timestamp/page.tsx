"use client";
import { useState } from "react";

/**
 * 时间戳转换工具 — Unix 时间戳 ↔ 人类可读日期
 */
export default function TimestampPage() {
    const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
    const [dateStr, setDateStr] = useState("");
    const [currentTs, setCurrentTs] = useState(Math.floor(Date.now() / 1000));
    const [copied, setCopied] = useState("");

    // 实时更新当前时间戳
    useState(() => {
        const timer = setInterval(() => setCurrentTs(Math.floor(Date.now() / 1000)), 1000);
        return () => clearInterval(timer);
    });

    const tsToDate = (): string => {
        const num = Number(timestamp);
        if (isNaN(num)) return "Invalid timestamp";
        // 自动检测秒/毫秒
        const ms = num > 1e12 ? num : num * 1000;
        const d = new Date(ms);
        return d.toISOString().replace("T", " ").replace("Z", " UTC");
    };

    const dateToTs = (): string => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Invalid date";
        return Math.floor(d.getTime() / 1000).toString();
    };

    const localDate = (): string => {
        const num = Number(timestamp);
        if (isNaN(num)) return "";
        const ms = num > 1e12 ? num : num * 1000;
        return new Date(ms).toLocaleString();
    };

    const copy = async (val: string, label: string) => {
        await navigator.clipboard.writeText(val);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <div className="tool-page">
            <h1>Timestamp Converter</h1>
            <p className="tool-description">
                Convert between Unix timestamps and human-readable dates.
            </p>

            {/* 当前时间戳 */}
            <div className="result-panel" style={{ marginTop: 0, textAlign: "center" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    Current Unix Timestamp
                </p>
                <p
                    style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        marginTop: 4,
                    }}
                >
                    {currentTs}
                </p>
                <button
                    className={`btn ${copied === "current" ? "btn-success" : "btn-secondary"}`}
                    style={{ marginTop: 8 }}
                    onClick={() => copy(currentTs.toString(), "current")}
                >
                    {copied === "current" ? "✓ Copied" : "Copy"}
                </button>
            </div>

            <div className="split-layout">
                {/* 时间戳 → 日期 */}
                <div className="result-panel">
                    <h3>⏱️ Timestamp → Date</h3>
                    <input
                        className="input"
                        placeholder="Enter Unix timestamp..."
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        style={{ marginBottom: 12 }}
                    />
                    <div className="stat-item" style={{ marginBottom: 8 }}>
                        <div className="stat-label">UTC</div>
                        <div className="stat-value" style={{ fontSize: "0.9375rem" }}>
                            {tsToDate()}
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Local</div>
                        <div className="stat-value" style={{ fontSize: "0.9375rem" }}>
                            {localDate()}
                        </div>
                    </div>
                    <button
                        className="btn btn-secondary"
                        style={{ marginTop: 12 }}
                        onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}
                    >
                        Use Current Time
                    </button>
                </div>

                {/* 日期 → 时间戳 */}
                <div className="result-panel">
                    <h3>📅 Date → Timestamp</h3>
                    <input
                        className="input"
                        type="datetime-local"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        style={{ marginBottom: 12 }}
                    />
                    {dateStr && (
                        <div className="stat-item">
                            <div className="stat-label">Unix Timestamp</div>
                            <div className="stat-value" style={{ fontFamily: "monospace" }}>
                                {dateToTs()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
