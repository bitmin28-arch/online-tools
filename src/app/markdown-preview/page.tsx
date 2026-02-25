"use client";
import { useState } from "react";

/**
 * Markdown 实时预览工具
 * NOTE: 使用简单的 regex 转换而不依赖外部库，保持轻量
 */
export default function MarkdownPreviewPage() {
    const [input, setInput] = useState(`# Hello Markdown!

This is a **bold** and *italic* text demo.

## Features
- Real-time preview
- No external libraries
- Clean design

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

> This is a blockquote

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

---

[Visit Google](https://google.com)
`);

    /** 简单的 Markdown → HTML 转换器 */
    const markdownToHtml = (md: string): string => {
        let html = md;

        // 代码块
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>');
        // 行内代码
        html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(99,102,241,0.15);padding:2px 6px;border-radius:4px;font-size:0.875em">$1</code>');
        // 标题
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        // 粗体和斜体
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // 链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--color-accent-light)">$1</a>');
        // 引用
        html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--color-accent);padding-left:12px;color:var(--color-text-secondary);margin:8px 0">$1</blockquote>');
        // 无序列表
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul style="padding-left:20px;margin:8px 0">$&</ul>');
        // 分割线
        html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--color-border);margin:16px 0">');
        // 简易表格
        html = html.replace(/^\|(.+)\|\s*\n\|[-| ]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, (_, header, body) => {
            const ths = header.split("|").map((h: string) => `<th style="padding:8px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary)">${h.trim()}</th>`).join("");
            const rows = body.trim().split("\n").map((row: string) => {
                const tds = row.replace(/^\||\|$/g, "").split("|").map((c: string) => `<td style="padding:8px 12px;border:1px solid var(--color-border)">${c.trim()}</td>`).join("");
                return `<tr>${tds}</tr>`;
            }).join("");
            return `<table style="border-collapse:collapse;width:100%;margin:8px 0"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
        });
        // 段落
        html = html.replace(/\n\n/g, '</p><p>');
        html = `<p>${html}</p>`;
        // 清理空段落
        html = html.replace(/<p>\s*<(h[1-6]|pre|ul|blockquote|hr|table)/g, '<$1');
        html = html.replace(/<\/(h[1-6]|pre|ul|blockquote|table)>\s*<\/p>/g, '</$1>');

        return html;
    };

    return (
        <div className="tool-page">
            <h1>Markdown Preview</h1>
            <p className="tool-description">Write Markdown on the left and see the rendered preview on the right.</p>

            <div className="split-layout">
                <div className="split-panel">
                    <label>Markdown</label>
                    <textarea
                        className="textarea"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ minHeight: 500 }}
                    />
                </div>
                <div className="split-panel">
                    <label>Preview</label>
                    <div
                        className="code-block"
                        style={{
                            minHeight: 500,
                            fontFamily: "Inter, sans-serif",
                            lineHeight: 1.7,
                            whiteSpace: "normal",
                            wordBreak: "normal",
                        }}
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(input) }}
                    />
                </div>
            </div>
        </div>
    );
}
