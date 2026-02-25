"use client";
import { useState } from "react";

/**
 * UUID 生成器 — 批量生成 UUID v4
 */
export default function UuidGeneratorPage() {
    const [count, setCount] = useState(5);
    const [uppercase, setUppercase] = useState(false);
    const [noDashes, setNoDashes] = useState(false);
    const [uuids, setUuids] = useState<string[]>([]);
    const [copied, setCopied] = useState(-1);

    const generateUuid = (): string => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f);
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const generate = () => {
        const result = Array.from({ length: count }, () => {
            let uuid = generateUuid();
            if (noDashes) uuid = uuid.replace(/-/g, "");
            if (uppercase) uuid = uuid.toUpperCase();
            return uuid;
        });
        setUuids(result);
    };

    const copyOne = async (uuid: string, index: number) => {
        await navigator.clipboard.writeText(uuid);
        setCopied(index);
        setTimeout(() => setCopied(-1), 2000);
    };

    const copyAll = async () => {
        await navigator.clipboard.writeText(uuids.join("\n"));
        setCopied(-2);
        setTimeout(() => setCopied(-1), 2000);
    };

    return (
        <div className="tool-page">
            <h1>UUID Generator</h1>
            <p className="tool-description">
                Generate random UUIDs (v4) using cryptographic randomness.
            </p>

            <div className="result-panel" style={{ marginTop: 0 }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Count</label>
                        <input className="input" type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 80 }} />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", cursor: "pointer" }}>
                        <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Uppercase
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", cursor: "pointer" }}>
                        <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} /> No dashes
                    </label>
                </div>
                <div className="actions-bar">
                    <button className="btn btn-primary btn-lg" onClick={generate}>
                        🔄 Generate
                    </button>
                    {uuids.length > 0 && (
                        <button className={`btn ${copied === -2 ? "btn-success" : "btn-secondary"}`} onClick={copyAll}>
                            {copied === -2 ? "✓ All Copied" : "Copy All"}
                        </button>
                    )}
                </div>
            </div>

            {uuids.length > 0 && (
                <div className="file-list" style={{ marginTop: 16 }}>
                    {uuids.map((uuid, i) => (
                        <div className="file-item" key={i}>
                            <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{uuid}</span>
                            <button
                                className={`btn ${copied === i ? "btn-success" : "btn-secondary"}`}
                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                onClick={() => copyOne(uuid, i)}
                            >
                                {copied === i ? "✓" : "Copy"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
