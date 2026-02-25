"use client";
import { useState } from "react";

/**
 * Lorem Ipsum 假文本生成器
 */

// NOTE: 经典 Lorem Ipsum 段落库
const LOREM_PARAGRAPHS = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.",
    "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.",
    "Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
];

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

export default function LoremIpsumPage() {
    const [count, setCount] = useState(3);
    const [unit, setUnit] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [copied, setCopied] = useState(false);

    const generate = (): string => {
        if (unit === "paragraphs") {
            const paras: string[] = [];
            for (let i = 0; i < count; i++) {
                if (i === 0 && startWithLorem) {
                    paras.push(LOREM_PARAGRAPHS[0]);
                } else {
                    paras.push(LOREM_PARAGRAPHS[Math.floor(Math.random() * LOREM_PARAGRAPHS.length)]);
                }
            }
            return paras.join("\n\n");
        }

        if (unit === "words") {
            const words: string[] = [];
            for (let i = 0; i < count; i++) {
                if (i === 0 && startWithLorem) {
                    words.push("Lorem");
                } else {
                    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
                }
            }
            // 首字母大写
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            return words.join(" ") + ".";
        }

        // sentences
        const sentences: string[] = [];
        for (let i = 0; i < count; i++) {
            const len = 8 + Math.floor(Math.random() * 12);
            const words: string[] = [];
            for (let j = 0; j < len; j++) {
                if (i === 0 && j === 0 && startWithLorem) {
                    words.push("Lorem");
                } else {
                    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
                }
            }
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            sentences.push(words.join(" ") + ".");
        }
        return sentences.join(" ");
    };

    const [output, setOutput] = useState(() => generate());

    const regenerate = () => setOutput(generate());

    const copy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const unitOptions = [
        { value: "paragraphs" as const, label: "Paragraphs" },
        { value: "words" as const, label: "Words" },
        { value: "sentences" as const, label: "Sentences" },
    ];

    return (
        <div className="tool-page">
            <h1>Lorem Ipsum Generator</h1>
            <p className="tool-description">Generate placeholder text for your designs and mockups.</p>

            <div className="result-panel" style={{ marginTop: 0 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 6 }}>Amount</label>
                        <input className="input" type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} style={{ width: 80 }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 6 }}>Unit</label>
                        <div className="toggle-group">
                            {unitOptions.map((o) => (
                                <button key={o.value} className={`toggle-btn ${unit === o.value ? "active" : ""}`} onClick={() => setUnit(o.value)}>{o.label}</button>
                            ))}
                        </div>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", cursor: "pointer", marginBottom: 4 }}>
                        <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} /> Start with &quot;Lorem ipsum...&quot;
                    </label>
                </div>
                <div className="actions-bar">
                    <button className="btn btn-primary btn-lg" onClick={regenerate}>Generate</button>
                    <button className={`btn ${copied ? "btn-success" : "btn-secondary"}`} onClick={copy}>{copied ? "✓ Copied!" : "Copy Text"}</button>
                </div>
            </div>

            <div className="result-panel">
                <div className="result-stats">
                    <div className="stat-item"><div className="stat-label">Characters</div><div className="stat-value">{output.length.toLocaleString()}</div></div>
                    <div className="stat-item"><div className="stat-label">Words</div><div className="stat-value">{output.split(/\s+/).filter(Boolean).length}</div></div>
                    <div className="stat-item"><div className="stat-label">Paragraphs</div><div className="stat-value">{output.split(/\n\n+/).filter(Boolean).length}</div></div>
                </div>
                <div className="code-block" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, maxHeight: 500, overflow: "auto" }}>
                    {output}
                </div>
            </div>
        </div>
    );
}
