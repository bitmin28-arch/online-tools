"use client";
import { useState, useMemo } from "react";

/**
 * 文本对比工具 — 逐行对比两段文本并高亮差异
 */
export default function TextDiffPage() {
    const [textA, setTextA] = useState("");
    const [textB, setTextB] = useState("");

    /** 简单的逐行 diff 实现（LCS 方式） */
    const diffResult = useMemo(() => {
        if (!textA && !textB) return [];
        const linesA = textA.split("\n");
        const linesB = textB.split("\n");

        // NOTE: 使用简化版本的逐行对比，适合中小文本
        const result: { type: "same" | "added" | "removed"; text: string }[] = [];
        const maxLen = Math.max(linesA.length, linesB.length);
        let idxA = 0, idxB = 0;

        while (idxA < linesA.length || idxB < linesB.length) {
            if (idxA < linesA.length && idxB < linesB.length) {
                if (linesA[idxA] === linesB[idxB]) {
                    result.push({ type: "same", text: linesA[idxA] });
                    idxA++;
                    idxB++;
                } else {
                    // 向前查找是否 A 中的行在 B 后面出现
                    let foundInB = -1;
                    for (let j = idxB + 1; j < Math.min(idxB + 5, linesB.length); j++) {
                        if (linesA[idxA] === linesB[j]) { foundInB = j; break; }
                    }
                    let foundInA = -1;
                    for (let j = idxA + 1; j < Math.min(idxA + 5, linesA.length); j++) {
                        if (linesB[idxB] === linesA[j]) { foundInA = j; break; }
                    }

                    if (foundInB !== -1 && (foundInA === -1 || foundInB - idxB <= foundInA - idxA)) {
                        // B 中有添加行
                        for (let j = idxB; j < foundInB; j++) {
                            result.push({ type: "added", text: linesB[j] });
                        }
                        idxB = foundInB;
                    } else if (foundInA !== -1) {
                        // A 中有删除行
                        for (let j = idxA; j < foundInA; j++) {
                            result.push({ type: "removed", text: linesA[j] });
                        }
                        idxA = foundInA;
                    } else {
                        result.push({ type: "removed", text: linesA[idxA] });
                        result.push({ type: "added", text: linesB[idxB] });
                        idxA++;
                        idxB++;
                    }
                }
            } else if (idxA < linesA.length) {
                result.push({ type: "removed", text: linesA[idxA] });
                idxA++;
            } else {
                result.push({ type: "added", text: linesB[idxB] });
                idxB++;
            }
        }
        return result;
    }, [textA, textB]);

    const added = diffResult.filter((d) => d.type === "added").length;
    const removed = diffResult.filter((d) => d.type === "removed").length;

    return (
        <div className="tool-page">
            <h1>Text Diff</h1>
            <p className="tool-description">Compare two texts and highlight the differences line by line.</p>

            <div className="split-layout">
                <div className="split-panel">
                    <label>Original Text</label>
                    <textarea className="textarea" placeholder="Paste original text here..." value={textA} onChange={(e) => setTextA(e.target.value)} style={{ minHeight: 250 }} />
                </div>
                <div className="split-panel">
                    <label>Modified Text</label>
                    <textarea className="textarea" placeholder="Paste modified text here..." value={textB} onChange={(e) => setTextB(e.target.value)} style={{ minHeight: 250 }} />
                </div>
            </div>

            {diffResult.length > 0 && (
                <div className="result-panel">
                    <h3>📋 Diff Result</h3>
                    <div className="result-stats" style={{ marginBottom: 16 }}>
                        <div className="stat-item">
                            <div className="stat-label">Added</div>
                            <div className="stat-value" style={{ color: "var(--color-success)" }}>+{added}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Removed</div>
                            <div className="stat-value" style={{ color: "var(--color-error)" }}>-{removed}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Unchanged</div>
                            <div className="stat-value">{diffResult.length - added - removed}</div>
                        </div>
                    </div>
                    <div className="code-block" style={{ padding: 0, overflow: "auto", maxHeight: 500 }}>
                        {diffResult.map((line, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "2px 16px",
                                    fontFamily: "monospace",
                                    fontSize: "0.8125rem",
                                    lineHeight: 1.7,
                                    background:
                                        line.type === "added" ? "rgba(16,185,129,0.12)" :
                                            line.type === "removed" ? "rgba(239,68,68,0.12)" : "transparent",
                                    color:
                                        line.type === "added" ? "#34d399" :
                                            line.type === "removed" ? "#f87171" : "var(--color-text)",
                                    borderLeft: `3px solid ${line.type === "added" ? "var(--color-success)" :
                                            line.type === "removed" ? "var(--color-error)" : "transparent"
                                        }`,
                                }}
                            >
                                <span style={{ display: "inline-block", width: 20, color: "var(--color-text-muted)", userSelect: "none" }}>
                                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                                </span>
                                {line.text || " "}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
