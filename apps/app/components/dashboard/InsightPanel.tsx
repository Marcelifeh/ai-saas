"use client";

import { useEffect, useState } from "react";

type Insight = {
    message: string;
    severity?: "info" | "success" | "warning" | "error" | string;
    icon?: string;
};

interface InsightPanelProps {
    insights: Insight[] | null;
}

export function InsightPanel({ insights }: InsightPanelProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!insights || insights.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                return insights.length > 0 ? next % insights.length : 0;
            });
        }, 8000);

        return () => clearInterval(timer);
    }, [insights]);

    if (!insights || insights.length === 0) return null;

    const activeInsight = insights[currentIndex];
    if (!activeInsight) return null;

    const colors: Record<string, string> = {
        info: "bg-blue-50/5 border-blue-500/40 text-blue-200",
        success: "bg-emerald-50/5 border-emerald-500/40 text-emerald-200",
        warning: "bg-amber-50/5 border-amber-500/40 text-amber-200",
        error: "bg-red-50/5 border-red-500/40 text-red-200",
    };

    const colorClass = colors[activeInsight.severity || "info"] || colors.info;

    return (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${colorClass} mb-6 shadow-sm bg-black/20`}>
            <div className="text-2xl">{activeInsight.icon || "✨"}</div>
            <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">
                    AI Strategic Insight ({currentIndex + 1}/{insights.length})
                </div>
                <div className="text-sm font-semibold text-gray-100">{activeInsight.message}</div>
            </div>
        </div>
    );
}
