import type { MetadataRoute } from "next";

/**
 * 自动生成 robots.txt
 * 允许所有搜索引擎爬取所有页面
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://online-tools-psi.vercel.app/sitemap.xml",
    };
}
