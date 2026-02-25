import type { MetadataRoute } from "next";

/**
 * 自动生成 sitemap.xml
 * 列出所有工具页面供搜索引擎索引
 */

const BASE_URL = "https://turnturnnturn.com";

const TOOL_SLUGS = [
    "image-compressor",
    "image-converter",
    "image-resizer",
    "image-to-ico",
    "svg-to-png",
    "pdf-merge",
    "pdf-split",
    "images-to-pdf",
    "word-to-pdf",
    "json-formatter",
    "base64",
    "hash-generator",
    "url-codec",
    "jwt-decoder",
    "timestamp",
    "regex-tester",
    "uuid-generator",
    "json-csv",
    "cron-parser",
    "meta-tags",
    "word-counter",
    "text-diff",
    "case-converter",
    "markdown-preview",
    "lorem-ipsum",
    "color-picker",
    "gradient-generator",
    "box-shadow",
    "qr-generator",
    "password-generator",
    "base-converter",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const toolPages = TOOL_SLUGS.map((slug) => ({
        url: `${BASE_URL}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        ...toolPages,
    ];
}
