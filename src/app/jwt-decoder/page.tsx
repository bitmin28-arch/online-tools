"use client";
import { useState } from "react";

/**
 * JWT 解码器 — 解析 JSON Web Token 的 Header 和 Payload
 * NOTE: 仅解码展示，不做签名验证
 */
export default function JwtDecoderPage() {
    const [token, setToken] = useState("");
    const [copied, setCopied] = useState("");

    /** Base64URL 解码 */
    const decodeBase64Url = (str: string): string => {
        try {
            const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
            const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
            return atob(padded);
        } catch {
            return "";
        }
    };

    const parts = token.trim().split(".");
    const isValid = parts.length === 3;

    let header = "";
    let payload = "";
    let headerObj: Record<string, unknown> = {};
    let payloadObj: Record<string, unknown> = {};

    if (isValid) {
        try {
            header = decodeBase64Url(parts[0]);
            headerObj = JSON.parse(header);
            header = JSON.stringify(headerObj, null, 2);
        } catch { header = "Invalid header"; }
        try {
            payload = decodeBase64Url(parts[1]);
            payloadObj = JSON.parse(payload);
            payload = JSON.stringify(payloadObj, null, 2);
        } catch { payload = "Invalid payload"; }
    }

    const isExpired = payloadObj.exp ? (payloadObj.exp as number) * 1000 < Date.now() : null;

    const copy = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    const loadSample = () => {
        // NOTE: 这是一个示例 JWT，仅用于演示解码功能
        setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    };

    return (
        <div className="tool-page">
            <h1>JWT Decoder</h1>
            <p className="tool-description">Decode and inspect JSON Web Tokens. No verification — for debugging only.</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button className="btn btn-secondary" onClick={loadSample}>Load Sample</button>
            </div>

            <textarea className="textarea" placeholder="Paste your JWT token here..." value={token} onChange={(e) => setToken(e.target.value)} style={{ minHeight: 100, fontFamily: "monospace", fontSize: "0.8125rem" }} />

            {token && !isValid && (
                <div className="result-panel" style={{ borderColor: "var(--color-error)" }}>
                    <p style={{ color: "var(--color-error)" }}>❌ Invalid JWT format. A JWT should have 3 parts separated by dots.</p>
                </div>
            )}

            {isValid && (
                <>
                    {isExpired !== null && (
                        <div className="result-panel" style={{ marginTop: 16, background: isExpired ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)" }}>
                            <p style={{ color: isExpired ? "var(--color-error)" : "var(--color-success)", fontWeight: 600 }}>
                                {isExpired ? "⚠️ This token is EXPIRED" : "✅ This token is still valid"}
                                {typeof payloadObj.exp === "number" && (
                                    <span style={{ fontWeight: 400, marginLeft: 8, fontSize: "0.8125rem" }}>
                                        (exp: {new Date(payloadObj.exp * 1000).toLocaleString()})
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                    <div className="split-layout" style={{ marginTop: 16 }}>
                        <div className="split-panel" style={{ position: "relative" }}>
                            <label>Header</label>
                            <button className={`copy-btn ${copied === "header" ? "copied" : ""}`} onClick={() => copy(header, "header")} style={{ top: 32, right: 0 }}>
                                {copied === "header" ? "✓" : "Copy"}
                            </button>
                            <div className="code-block" style={{ minHeight: 120 }}>{header}</div>
                        </div>
                        <div className="split-panel" style={{ position: "relative" }}>
                            <label>Payload</label>
                            <button className={`copy-btn ${copied === "payload" ? "copied" : ""}`} onClick={() => copy(payload, "payload")} style={{ top: 32, right: 0 }}>
                                {copied === "payload" ? "✓" : "Copy"}
                            </button>
                            <div className="code-block" style={{ minHeight: 120 }}>{payload}</div>
                        </div>
                    </div>

                    <div className="result-panel">
                        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)" }}>SIGNATURE</label>
                        <div className="code-block" style={{ fontSize: "0.75rem", marginTop: 4 }}>{parts[2]}</div>
                    </div>
                </>
            )}
        </div>
    );
}
