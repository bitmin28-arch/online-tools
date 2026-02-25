"use client";
import { useState } from "react";

/**
 * Meta Tag 生成器 — 生成 HTML meta 标签用于 SEO 和社交分享
 */
export default function MetaTagPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState("");
    const [siteName, setSiteName] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");
    const [copied, setCopied] = useState(false);

    const generateMeta = (): string => {
        const lines: string[] = [
            "<!-- Primary Meta Tags -->",
            title ? `<title>${title}</title>` : "",
            title ? `<meta name="title" content="${title}">` : "",
            description ? `<meta name="description" content="${description}">` : "",
            keywords ? `<meta name="keywords" content="${keywords}">` : "",
            author ? `<meta name="author" content="${author}">` : "",
            "",
            "<!-- Open Graph / Facebook -->",
            `<meta property="og:type" content="website">`,
            url ? `<meta property="og:url" content="${url}">` : "",
            title ? `<meta property="og:title" content="${title}">` : "",
            description ? `<meta property="og:description" content="${description}">` : "",
            image ? `<meta property="og:image" content="${image}">` : "",
            siteName ? `<meta property="og:site_name" content="${siteName}">` : "",
            "",
            "<!-- Twitter -->",
            `<meta property="twitter:card" content="summary_large_image">`,
            url ? `<meta property="twitter:url" content="${url}">` : "",
            title ? `<meta property="twitter:title" content="${title}">` : "",
            description ? `<meta property="twitter:description" content="${description}">` : "",
            image ? `<meta property="twitter:image" content="${image}">` : "",
            twitterHandle ? `<meta property="twitter:creator" content="${twitterHandle}">` : "",
        ];
        return lines.filter((l) => l !== "").join("\n");
    };

    const output = generateMeta();

    const copy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fields = [
        { label: "Page Title", value: title, set: setTitle, placeholder: "My Awesome Page", maxLength: 60, hint: `${title.length}/60 characters` },
        { label: "Description", value: description, set: setDescription, placeholder: "A brief description of the page content...", maxLength: 160, hint: `${description.length}/160 characters`, multiline: true },
        { label: "Keywords", value: keywords, set: setKeywords, placeholder: "keyword1, keyword2, keyword3" },
        { label: "Author", value: author, set: setAuthor, placeholder: "John Doe" },
        { label: "Page URL", value: url, set: setUrl, placeholder: "https://example.com/page" },
        { label: "Image URL", value: image, set: setImage, placeholder: "https://example.com/og-image.jpg" },
        { label: "Site Name", value: siteName, set: setSiteName, placeholder: "My Website" },
        { label: "Twitter Handle", value: twitterHandle, set: setTwitterHandle, placeholder: "@username" },
    ];

    return (
        <div className="tool-page">
            <h1>Meta Tag Generator</h1>
            <p className="tool-description">Generate HTML meta tags for SEO, Open Graph, and Twitter Cards.</p>

            <div className="split-layout">
                <div className="split-panel">
                    <label style={{ fontSize: "1rem", fontWeight: 700 }}>Page Info</label>
                    {fields.map((f) => (
                        <div key={f.label} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{f.label}</label>
                                {"hint" in f && f.hint && (
                                    <span style={{
                                        fontSize: "0.6875rem",
                                        color: ("maxLength" in f && f.maxLength && f.value.length > f.maxLength) ? "var(--color-error)" : "var(--color-text-muted)",
                                    }}>{f.hint}</span>
                                )}
                            </div>
                            {"multiline" in f && f.multiline ? (
                                <textarea className="textarea" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} style={{ minHeight: 80 }} />
                            ) : (
                                <input className="input" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="split-panel" style={{ position: "relative" }}>
                    <label style={{ fontSize: "1rem", fontWeight: 700 }}>Generated Tags</label>
                    <div style={{ display: "flex", gap: 6, position: "absolute", top: 4, right: 0 }}>
                        <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
                            {copied ? "✓ Copied" : "Copy All"}
                        </button>
                    </div>
                    <div className="code-block" style={{ minHeight: 400, whiteSpace: "pre-wrap", fontSize: "0.8125rem" }}>
                        {output}
                    </div>

                    {/* Google 搜索预览 */}
                    {title && (
                        <div style={{ marginTop: 16 }}>
                            <label style={{ fontSize: "0.8125rem", fontWeight: 700 }}>🔍 Google Preview</label>
                            <div style={{
                                background: "white", borderRadius: "var(--radius-sm)", padding: 16, marginTop: 8,
                            }}>
                                <div style={{ fontSize: "1.125rem", color: "#1a0dab", fontFamily: "Arial, sans-serif", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {title}
                                </div>
                                <div style={{ fontSize: "0.8125rem", color: "#006621", marginBottom: 4 }}>{url || "https://example.com"}</div>
                                <div style={{ fontSize: "0.8125rem", color: "#545454", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {description || "No description provided"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
