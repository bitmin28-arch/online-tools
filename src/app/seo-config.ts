/**
 * 所有工具页面的 SEO 元数据配置
 * 用于各工具路由的 layout.tsx 中导出 metadata
 */
import type { Metadata } from "next";

const SITE_NAME = "TurnTurnTurn";
const BASE_URL = "https://turnturnnturn.com";

export const toolMetadata: Record<string, Metadata> = {
    "image-compressor": {
        title: "Image Compressor — Compress JPG, PNG, WebP Online Free",
        description: "Compress images online for free. Reduce file size while maintaining quality. Supports JPG, PNG, and WebP. No upload — runs in your browser.",
        keywords: ["image compressor", "compress jpg", "compress png", "reduce image size", "online image compression"],
    },
    "image-converter": {
        title: "Image Converter — Convert JPG, PNG, WebP, BMP Online",
        description: "Convert images between JPG, PNG, WebP, and BMP formats instantly. Free online tool, no upload needed — everything runs in your browser.",
        keywords: ["image converter", "convert jpg to png", "convert png to webp", "image format converter"],
    },
    "image-resizer": {
        title: "Image Resizer — Resize Images to Exact Dimensions",
        description: "Resize images by pixels or percentage. Maintain aspect ratio. Free online image resizer — no upload, runs in your browser.",
        keywords: ["image resizer", "resize image online", "resize photo", "change image dimensions"],
    },
    "image-to-ico": {
        title: "Image to ICO Converter — Create Favicons Online",
        description: "Convert any image to favicon-sized ICO/PNG icons. Generate multiple sizes (16x16 to 256x256). Free online favicon generator.",
        keywords: ["image to ico", "favicon generator", "ico converter", "favicon maker"],
    },
    "svg-to-png": {
        title: "SVG to PNG Converter — High Resolution Export",
        description: "Convert SVG files to high-resolution PNG images. Upload or paste SVG code. Adjust scale up to 8x. Free online tool.",
        keywords: ["svg to png", "convert svg", "svg converter", "svg to image"],
    },
    "pdf-merge": {
        title: "PDF Merge — Combine PDF Files Online Free",
        description: "Merge multiple PDF files into one document. Drag to reorder pages. Free online tool — your files never leave your device.",
        keywords: ["pdf merge", "combine pdf", "merge pdf files", "join pdf", "pdf combiner"],
    },
    "pdf-split": {
        title: "PDF Split — Extract Pages from PDF Online",
        description: "Split PDF files or extract specific pages. Enter page ranges like 1-3, 5, 7-9. Free online tool, no upload needed.",
        keywords: ["pdf split", "extract pdf pages", "split pdf online", "pdf page extractor"],
    },
    "images-to-pdf": {
        title: "Images to PDF — Convert Multiple Images to PDF",
        description: "Combine multiple images into a single PDF document. Drag to reorder. Supports JPG, PNG, WebP. Free online tool.",
        keywords: ["images to pdf", "jpg to pdf", "png to pdf", "convert images to pdf"],
    },
    "word-to-pdf": {
        title: "Word to PDF — Convert DOCX to PDF Online Free",
        description: "Convert Word documents (.docx) to PDF format in your browser. Preview and save as PDF. Free online tool, no upload needed.",
        keywords: ["word to pdf", "docx to pdf", "convert word to pdf", "doc to pdf online"],
    },
    "json-formatter": {
        title: "JSON Formatter & Validator — Format, Minify, Validate JSON",
        description: "Format, validate, and minify JSON data online. Syntax highlighting, error detection, customizable indentation. Free JSON beautifier.",
        keywords: ["json formatter", "json validator", "json beautifier", "format json", "json minifier"],
    },
    "base64": {
        title: "Base64 Encoder/Decoder — Encode & Decode Base64 Online",
        description: "Encode text to Base64 or decode Base64 back to text. Supports Unicode characters. Free online Base64 tool.",
        keywords: ["base64 encoder", "base64 decoder", "base64 encode", "base64 decode", "base64 online"],
    },
    "hash-generator": {
        title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Online",
        description: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text. Free online hash calculator.",
        keywords: ["hash generator", "md5 hash", "sha256 hash", "sha1 generator", "hash calculator"],
    },
    "url-codec": {
        title: "URL Encoder/Decoder — Encode & Decode URLs Online",
        description: "Encode or decode URL components for web development. Free online URL encoding and decoding tool.",
        keywords: ["url encoder", "url decoder", "url encode online", "encodeURIComponent", "url decode"],
    },
    "jwt-decoder": {
        title: "JWT Decoder — Decode & Inspect JSON Web Tokens",
        description: "Decode JWT tokens and inspect header, payload, and signature. Check token expiration. Free online JWT debugger.",
        keywords: ["jwt decoder", "jwt debugger", "decode jwt", "json web token decoder", "jwt parser"],
    },
    "timestamp": {
        title: "Unix Timestamp Converter — Convert Epoch Time Online",
        description: "Convert between Unix timestamps and human-readable dates. Live clock with current timestamp. Free online time converter.",
        keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp"],
    },
    "regex-tester": {
        title: "Regex Tester — Test Regular Expressions Online",
        description: "Test and debug regular expressions with real-time matching and highlighting. Supports all JavaScript regex flags. Free online regex tool.",
        keywords: ["regex tester", "regular expression tester", "regex debugger", "test regex online", "regex matcher"],
    },
    "uuid-generator": {
        title: "UUID Generator — Generate Random UUIDs Online",
        description: "Generate random UUID v4 identifiers. Bulk generation, uppercase, no-dash options. Free online UUID tool.",
        keywords: ["uuid generator", "generate uuid", "uuid v4", "random uuid", "guid generator"],
    },
    "json-csv": {
        title: "JSON to CSV Converter — Convert JSON ↔ CSV Online",
        description: "Convert JSON arrays to CSV format or CSV to JSON. Handles quoted fields and commas. Free online converter.",
        keywords: ["json to csv", "csv to json", "convert json to csv", "json csv converter"],
    },
    "cron-parser": {
        title: "Cron Expression Parser — Understand Cron Jobs Online",
        description: "Parse and understand cron expressions. See human-readable descriptions and next 5 run times. Free online cron tool.",
        keywords: ["cron parser", "cron expression", "crontab guru", "cron job scheduler", "cron generator"],
    },
    "meta-tags": {
        title: "Meta Tag Generator — SEO, Open Graph & Twitter Cards",
        description: "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Google search preview. Free online meta tag tool.",
        keywords: ["meta tag generator", "og tags", "twitter card generator", "seo meta tags", "open graph generator"],
    },
    "word-counter": {
        title: "Word Counter — Count Words, Characters, Sentences",
        description: "Count words, characters, sentences, and paragraphs in your text. Plus text transformation tools. Free online word counter.",
        keywords: ["word counter", "character counter", "word count online", "letter counter", "text counter"],
    },
    "text-diff": {
        title: "Text Diff — Compare Two Texts Online",
        description: "Compare two texts and highlight differences line by line. Added, removed, and unchanged lines. Free online diff tool.",
        keywords: ["text diff", "compare text", "diff checker", "text compare online", "find differences"],
    },
    "case-converter": {
        title: "Case Converter — UPPERCASE, lowercase, Title Case & More",
        description: "Convert text between 10 formats: UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more. Free online tool.",
        keywords: ["case converter", "uppercase converter", "lowercase converter", "title case", "camelcase converter"],
    },
    "markdown-preview": {
        title: "Markdown Preview — Live Markdown Editor & Renderer",
        description: "Write Markdown and see live rendered preview. Supports headings, bold, italic, lists, code blocks, tables, and more. Free online tool.",
        keywords: ["markdown preview", "markdown editor", "markdown renderer", "markdown viewer online"],
    },
    "lorem-ipsum": {
        title: "Lorem Ipsum Generator — Placeholder Text for Design",
        description: "Generate Lorem Ipsum placeholder text by paragraphs, words, or sentences. Free online dummy text generator for designers.",
        keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "lorem ipsum", "filler text"],
    },
    "color-picker": {
        title: "Color Picker — HEX, RGB, HSL Color Converter",
        description: "Pick colors and convert between HEX, RGB, and HSL formats. Visual color picker with sliders. Free online color tool.",
        keywords: ["color picker", "hex to rgb", "rgb to hsl", "color converter", "color code"],
    },
    "gradient-generator": {
        title: "CSS Gradient Generator — Linear & Radial Gradients",
        description: "Create beautiful CSS gradients with a visual editor. Linear and radial, angle control, presets. Free online gradient maker.",
        keywords: ["css gradient generator", "gradient maker", "linear gradient", "radial gradient", "css gradient"],
    },
    "box-shadow": {
        title: "CSS Box Shadow Generator — Visual Shadow Editor",
        description: "Design CSS box shadows with sliders. Horizontal, vertical, blur, spread, color and opacity controls. Free online tool.",
        keywords: ["box shadow generator", "css shadow", "box shadow css", "shadow generator", "css box shadow"],
    },
    "qr-generator": {
        title: "QR Code Generator — Create QR Codes Online Free",
        description: "Generate QR codes from text, URLs, or any data. Custom colors and sizes. Download as PNG. Free online QR code maker.",
        keywords: ["qr code generator", "create qr code", "qr maker", "qr code online", "generate qr"],
    },
    "password-generator": {
        title: "Password Generator — Strong Random Passwords",
        description: "Generate strong, random passwords with custom length and character types. Password strength meter. Free online tool.",
        keywords: ["password generator", "random password", "strong password", "secure password generator"],
    },
    "base-converter": {
        title: "Number Base Converter — Binary, Octal, Decimal, Hex",
        description: "Convert numbers between binary, octal, decimal, and hexadecimal. Bit info and power-of-2 check. Free online tool.",
        keywords: ["number base converter", "binary converter", "hex to decimal", "decimal to binary", "base converter"],
    },
};

/**
 * 根据工具路由名获取完整 metadata
 */
export function getToolMetadata(slug: string): Metadata {
    const meta = toolMetadata[slug];
    if (!meta) return {};
    return {
        ...meta,
        openGraph: {
            title: meta.title as string,
            description: meta.description as string,
            siteName: SITE_NAME,
            type: "website",
            url: `${BASE_URL}/${slug}`,
        },
        twitter: {
            card: "summary",
            title: meta.title as string,
            description: meta.description as string,
        },
        alternates: {
            canonical: `${BASE_URL}/${slug}`,
        },
    };
}
