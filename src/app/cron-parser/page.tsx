"use client";
import { useState, useMemo } from "react";

/**
 * Cron 表达式解析器 — 解析和生成 cron 表达式，并显示下次运行时间
 */

/** 将 cron 字段解析为人可读描述 */
const describeCronField = (field: string, type: "minute" | "hour" | "day" | "month" | "weekday"): string => {
    const labels: Record<string, string> = { minute: "minute", hour: "hour", day: "day of month", month: "month", weekday: "day of week" };
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (field === "*") return `every ${labels[type]}`;
    if (field.includes("/")) {
        const [, step] = field.split("/");
        return `every ${step} ${labels[type]}${Number(step) > 1 ? "s" : ""}`;
    }
    if (field.includes("-")) {
        const [start, end] = field.split("-");
        if (type === "weekday") return `${weekdays[Number(start)] || start} through ${weekdays[Number(end)] || end}`;
        return `${labels[type]} ${start} through ${end}`;
    }
    if (field.includes(",")) {
        const parts = field.split(",").map((v) => {
            if (type === "weekday") return weekdays[Number(v)] || v;
            if (type === "month") return months[Number(v)] || v;
            return v;
        });
        return `at ${labels[type]} ${parts.join(", ")}`;
    }
    if (type === "weekday") return `on ${weekdays[Number(field)] || field}`;
    if (type === "month") return `in ${months[Number(field)] || field}`;
    return `at ${labels[type]} ${field}`;
};

const PRESETS = [
    { label: "Every minute", cron: "* * * * *" },
    { label: "Every hour", cron: "0 * * * *" },
    { label: "Every day at midnight", cron: "0 0 * * *" },
    { label: "Every Monday at 9 AM", cron: "0 9 * * 1" },
    { label: "Every 5 minutes", cron: "*/5 * * * *" },
    { label: "Every day at 6 PM", cron: "0 18 * * *" },
    { label: "Every 1st of month", cron: "0 0 1 * *" },
    { label: "Weekdays at 9 AM", cron: "0 9 * * 1-5" },
];

export default function CronParserPage() {
    const [cron, setCron] = useState("*/5 * * * *");
    const [copied, setCopied] = useState(false);

    const parsed = useMemo(() => {
        const parts = cron.trim().split(/\s+/);
        if (parts.length !== 5) return null;
        return {
            minute: parts[0],
            hour: parts[1],
            day: parts[2],
            month: parts[3],
            weekday: parts[4],
        };
    }, [cron]);

    const description = useMemo(() => {
        if (!parsed) return "Invalid cron expression (must have exactly 5 fields)";
        try {
            const parts = [
                describeCronField(parsed.minute, "minute"),
                describeCronField(parsed.hour, "hour"),
                describeCronField(parsed.day, "day"),
                describeCronField(parsed.month, "month"),
                describeCronField(parsed.weekday, "weekday"),
            ];
            return parts.filter((p) => !p.startsWith("every")).length === 0
                ? "Runs " + parts.join(", ")
                : "Runs " + parts.join(", ");
        } catch {
            return "Unable to parse expression";
        }
    }, [parsed]);

    /** 计算接下来 5 次运行时间（简化版） */
    const nextRuns = useMemo(() => {
        if (!parsed) return [];
        try {
            const results: Date[] = [];
            const now = new Date();
            const current = new Date(now);
            current.setSeconds(0);
            current.setMilliseconds(0);

            const matchField = (value: number, field: string): boolean => {
                if (field === "*") return true;
                if (field.includes("/")) {
                    const [base, step] = field.split("/");
                    const start = base === "*" ? 0 : Number(base);
                    return (value - start) % Number(step) === 0 && value >= start;
                }
                if (field.includes("-")) {
                    const [min, max] = field.split("-").map(Number);
                    return value >= min && value <= max;
                }
                if (field.includes(",")) return field.split(",").map(Number).includes(value);
                return value === Number(field);
            };

            // 向前搜索最多 525600 分钟（一年）
            for (let i = 0; i < 525600 && results.length < 5; i++) {
                current.setMinutes(current.getMinutes() + 1);
                if (
                    matchField(current.getMinutes(), parsed.minute) &&
                    matchField(current.getHours(), parsed.hour) &&
                    matchField(current.getDate(), parsed.day) &&
                    matchField(current.getMonth() + 1, parsed.month) &&
                    matchField(current.getDay(), parsed.weekday)
                ) {
                    results.push(new Date(current));
                }
            }
            return results;
        } catch {
            return [];
        }
    }, [parsed]);

    const copy = async () => {
        await navigator.clipboard.writeText(cron);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fieldLabels = ["Minute", "Hour", "Day (Month)", "Month", "Day (Week)"];

    return (
        <div className="tool-page">
            <h1>Cron Expression Parser</h1>
            <p className="tool-description">Parse, validate, and understand cron expressions. See when your cron job will run next.</p>

            <div style={{ position: "relative" }}>
                <input
                    className="input"
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                    placeholder="* * * * *"
                    style={{ fontFamily: "monospace", fontSize: "1.25rem", textAlign: "center", letterSpacing: "0.15em", padding: "16px 80px 16px 16px" }}
                />
                <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}>
                    {copied ? "✓" : "Copy"}
                </button>
            </div>

            {/* 字段标签 */}
            {parsed && (
                <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 8 }}>
                    {fieldLabels.map((label, i) => (
                        <div key={label} style={{ textAlign: "center", flex: 1, maxWidth: 100 }}>
                            <div style={{ fontSize: "0.9375rem", fontFamily: "monospace", fontWeight: 700, color: "var(--color-accent-light)" }}>
                                {cron.trim().split(/\s+/)[i] || "—"}
                            </div>
                            <div style={{ fontSize: "0.625rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* 预设 */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
                {PRESETS.map((p) => (
                    <button key={p.cron} className={`btn ${cron === p.cron ? "btn-primary" : "btn-secondary"}`} style={{ padding: "6px 12px", fontSize: "0.75rem" }} onClick={() => setCron(p.cron)}>
                        {p.label}
                    </button>
                ))}
            </div>

            {/* 描述 */}
            <div className="result-panel">
                <h3>📖 Description</h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>{description}</p>
            </div>

            {/* 下次运行时间 */}
            {nextRuns.length > 0 && (
                <div className="result-panel">
                    <h3>🕐 Next 5 Runs</h3>
                    <div className="file-list">
                        {nextRuns.map((date, i) => (
                            <div className="file-item" key={i}>
                                <div className="file-item-info">
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", width: 24 }}>#{i + 1}</span>
                                    <span className="file-item-name">{date.toLocaleString()}</span>
                                    <span className="file-item-size">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
