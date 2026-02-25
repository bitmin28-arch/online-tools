"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * 主题切换按钮组件
 * 切换逻辑：system → light → dark → system（循环）
 * 使用 localStorage 持久化用户选择
 */
export default function ThemeToggle() {
    const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute("data-theme", saved);
        }
    }, []);

    const toggle = useCallback(() => {
        setTheme((prev) => {
            let next: "system" | "light" | "dark";
            if (prev === "system") next = "light";
            else if (prev === "light") next = "dark";
            else next = "system";

            if (next === "system") {
                document.documentElement.removeAttribute("data-theme");
                localStorage.removeItem("theme");
            } else {
                document.documentElement.setAttribute("data-theme", next);
                localStorage.setItem("theme", next);
            }
            return next;
        });
    }, []);

    const icon = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻";

    return (
        <button
            className="theme-toggle"
            onClick={toggle}
            title={`Theme: ${theme}`}
            aria-label={`Switch theme (current: ${theme})`}
        >
            {icon}
        </button>
    );
}
