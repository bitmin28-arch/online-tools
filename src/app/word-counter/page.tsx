"use client";
import { useState } from "react";

/**
 * 字数统计工具 — 统计字符、单词、句子、段落等
 */
export default function WordCounterPage() {
    const [text, setText] = useState("");

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim()
        ? text.split(/[.!?]+/).filter((s) => s.trim()).length
        : 0;
    const paragraphs = text.trim()
        ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
        : 0;
    const lines = text ? text.split("\n").length : 0;

    // 阅读时间估算（平均 200 词/分钟）
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return (
        <div className="tool-page">
            <h1>Word Counter</h1>
            <p className="tool-description">
                Count words, characters, sentences, and paragraphs. Estimated reading time included.
            </p>

            <div className="result-stats" style={{ marginBottom: 20 }}>
                {[
                    { label: "Characters", value: chars.toLocaleString() },
                    { label: "No Spaces", value: charsNoSpaces.toLocaleString() },
                    { label: "Words", value: words.toLocaleString() },
                    { label: "Sentences", value: sentences.toLocaleString() },
                    { label: "Paragraphs", value: paragraphs.toLocaleString() },
                    { label: "Lines", value: lines.toLocaleString() },
                    { label: "Reading Time", value: `~${readingTime} min` },
                ].map((stat) => (
                    <div className="stat-item" key={stat.label}>
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <textarea
                className="textarea"
                placeholder="Start typing or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ minHeight: 400 }}
            />

            {text && (
                <div className="actions-bar">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setText(text.toUpperCase())}
                    >
                        UPPERCASE
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setText(text.toLowerCase())}
                    >
                        lowercase
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            const lines = text.split("\n");
                            const unique = [...new Set(lines)];
                            setText(unique.join("\n"));
                        }}
                    >
                        Remove Duplicates
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setText(text.replace(/^\s+|\s+$/gm, ""))}
                    >
                        Trim Lines
                    </button>
                    <button className="btn btn-secondary" onClick={() => setText("")}>
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
