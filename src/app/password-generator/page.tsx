"use client";
import { useState } from "react";

/**
 * 密码生成器 — 生成强随机密码
 * 使用 crypto.getRandomValues 保证密码安全性
 */
export default function PasswordGeneratorPage() {
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    const generatePassword = () => {
        let chars = "";
        if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
        if (numbers) chars += "0123456789";
        if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if (!chars) return;

        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        const result = Array.from(array)
            .map((n) => chars[n % chars.length])
            .join("");
        setPassword(result);
        setHistory((prev) => [result, ...prev.slice(0, 9)]);
    };

    const copyPassword = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /** 密码强度评估 — 基于长度和字符集多样性 */
    const getStrength = (): { label: string; color: string; width: string } => {
        if (!password) return { label: "", color: "", width: "0%" };
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        if (score <= 2) return { label: "Weak", color: "var(--color-error)", width: "25%" };
        if (score <= 4) return { label: "Fair", color: "var(--color-warning)", width: "50%" };
        if (score <= 5) return { label: "Strong", color: "var(--color-accent)", width: "75%" };
        return { label: "Very Strong", color: "var(--color-success)", width: "100%" };
    };

    const strength = getStrength();

    return (
        <div className="tool-page">
            <h1>Password Generator</h1>
            <p className="tool-description">
                Generate strong, random passwords. Uses cryptographic randomness for maximum security.
            </p>

            {/* 生成结果 */}
            <div
                className="result-panel"
                style={{ textAlign: "center", marginTop: 0 }}
            >
                <div
                    className="code-block"
                    style={{
                        fontSize: password ? "1.5rem" : "1rem",
                        padding: 24,
                        letterSpacing: "0.05em",
                        color: password ? "var(--color-text)" : "var(--color-text-muted)",
                        wordBreak: "break-all",
                    }}
                >
                    {password || "Click Generate to create a password"}
                </div>
                {password && (
                    <>
                        <div className="progress-bar" style={{ marginTop: 12 }}>
                            <div
                                className="progress-fill"
                                style={{
                                    width: strength.width,
                                    background: strength.color,
                                }}
                            />
                        </div>
                        <p
                            style={{
                                fontSize: "0.8125rem",
                                color: strength.color,
                                marginTop: 6,
                                fontWeight: 600,
                            }}
                        >
                            {strength.label}
                        </p>
                    </>
                )}
                <div className="actions-bar" style={{ justifyContent: "center", marginTop: 16 }}>
                    <button className="btn btn-primary btn-lg" onClick={generatePassword}>
                        🔄 Generate
                    </button>
                    {password && (
                        <button
                            className={`btn ${copied ? "btn-success" : "btn-secondary"}`}
                            onClick={() => copyPassword(password)}
                        >
                            {copied ? "✓ Copied" : "📋 Copy"}
                        </button>
                    )}
                </div>
            </div>

            {/* 选项 */}
            <div className="result-panel">
                <h3>⚙️ Options</h3>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        Length: {length}
                    </label>
                    <input
                        type="range"
                        min={4}
                        max={64}
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        style={{ width: "100%", marginTop: 8 }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        <span>4</span>
                        <span>64</span>
                    </div>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                    }}
                >
                    {[
                        { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
                        { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
                        { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
                        { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
                    ].map((opt) => (
                        <label
                            key={opt.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                padding: "8px 12px",
                                background: opt.checked ? "rgba(99, 102, 241, 0.1)" : "var(--color-bg-secondary)",
                                borderRadius: "var(--radius-sm)",
                                border: `1px solid ${opt.checked ? "var(--color-accent)" : "var(--color-border)"}`,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={opt.checked}
                                onChange={(e) => opt.set(e.target.checked)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* 历史记录 */}
            {history.length > 0 && (
                <div className="result-panel">
                    <h3>📜 Recent Passwords</h3>
                    <div className="file-list">
                        {history.map((pw, i) => (
                            <div className="file-item" key={i}>
                                <span
                                    className="file-item-name"
                                    style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}
                                >
                                    {pw}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                    onClick={() => copyPassword(pw)}
                                >
                                    Copy
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
