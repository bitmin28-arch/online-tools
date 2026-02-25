"use client";
import { useState, useCallback } from "react";

/**
 * JSON ↔ CSV 互转工具
 * 支持 JSON 数组转 CSV 和 CSV 转 JSON 数组
 */
export default function JsonCsvPage() {
    const [mode, setMode] = useState<"json2csv" | "csv2json">("json2csv");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const jsonSample = `[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "London" },
  { "name": "Charlie", "age": 35, "city": "Tokyo" }
]`;

    const csvSample = `name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Tokyo`;

    const jsonToCsv = (json: string): string => {
        const arr = JSON.parse(json);
        if (!Array.isArray(arr) || arr.length === 0) throw new Error("Input must be a non-empty JSON array");
        const headers = Object.keys(arr[0]);
        const rows = arr.map((obj: Record<string, unknown>) =>
            headers.map((h) => {
                const val = String(obj[h] ?? "");
                // NOTE: 含逗号或引号的值需要用引号包裹
                return val.includes(",") || val.includes('"') || val.includes("\n")
                    ? `"${val.replace(/"/g, '""')}"` : val;
            }).join(",")
        );
        return [headers.join(","), ...rows].join("\n");
    };

    const csvToJson = (csv: string): string => {
        const lines = csv.trim().split("\n");
        if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");
        const headers = parseCsvLine(lines[0]);
        const result = lines.slice(1).filter((l) => l.trim()).map((line) => {
            const values = parseCsvLine(line);
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => { obj[h] = values[i] || ""; });
            return obj;
        });
        return JSON.stringify(result, null, 2);
    };

    /** 解析 CSV 单行（处理引号内的逗号） */
    const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (inQuotes) {
                if (char === '"' && line[i + 1] === '"') { current += '"'; i++; }
                else if (char === '"') { inQuotes = false; }
                else { current += char; }
            } else {
                if (char === '"') { inQuotes = true; }
                else if (char === ",") { result.push(current); current = ""; }
                else { current += char; }
            }
        }
        result.push(current);
        return result;
    };

    const convert = () => {
        setError("");
        try {
            setOutput(mode === "json2csv" ? jsonToCsv(input) : csvToJson(input));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Conversion failed");
            setOutput("");
        }
    };

    const copy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        const ext = mode === "json2csv" ? "csv" : "json";
        const mime = mode === "json2csv" ? "text/csv" : "application/json";
        const blob = new Blob([output], { type: mime });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `converted.${ext}`;
        a.click();
    };

    return (
        <div className="tool-page">
            <h1>JSON ↔ CSV Converter</h1>
            <p className="tool-description">Convert between JSON arrays and CSV format.</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div className="toggle-group">
                    <button className={`toggle-btn ${mode === "json2csv" ? "active" : ""}`} onClick={() => { setMode("json2csv"); setInput(""); setOutput(""); setError(""); }}>JSON → CSV</button>
                    <button className={`toggle-btn ${mode === "csv2json" ? "active" : ""}`} onClick={() => { setMode("csv2json"); setInput(""); setOutput(""); setError(""); }}>CSV → JSON</button>
                </div>
                <button className="btn btn-secondary" onClick={() => setInput(mode === "json2csv" ? jsonSample : csvSample)}>Load Sample</button>
                <button className="btn btn-primary" onClick={convert}>Convert</button>
            </div>

            {error && <p style={{ color: "var(--color-error)", fontSize: "0.875rem", marginBottom: 12 }}>❌ {error}</p>}

            <div className="split-layout">
                <div className="split-panel">
                    <label>{mode === "json2csv" ? "JSON Input" : "CSV Input"}</label>
                    <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "json2csv" ? "Paste JSON array..." : "Paste CSV data..."} style={{ minHeight: 300 }} />
                </div>
                <div className="split-panel" style={{ position: "relative" }}>
                    <label>{mode === "json2csv" ? "CSV Output" : "JSON Output"}</label>
                    {output && (
                        <div style={{ display: "flex", gap: 4, position: "absolute", top: 28, right: 0 }}>
                            <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>
                            <button className="copy-btn" onClick={download}>Download</button>
                        </div>
                    )}
                    <div className="code-block" style={{ minHeight: 300, whiteSpace: "pre-wrap" }}>{output || "Result will appear here..."}</div>
                </div>
            </div>
        </div>
    );
}
