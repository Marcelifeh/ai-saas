"use client";

import { useState, useEffect, useMemo } from "react";
import { useFactory } from "../../../hooks/useFactory";
import { AiUsageWidget } from "../../../components/dashboard/AiUsageWidget";
import { Zap, Sparkles, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "tf_slogan_intelligence_state_v1";

type RankedSlogan = {
    slogan: string;
    score: number;
    bucket: "top" | "bold" | "experimental";
    hookScore?: number;
    emotionalTriggerScore?: number;
    wearability?: number;
    memorability?: number;
    punch?: number;
    visualFit?: number;
    marketSignalScore?: number;
    pattern?: string;
    reasons?: string[];
};
/* eslint-disable @typescript-eslint/no-explicit-any */

const PRESET_STYLES = ["Vintage Distressed", "Bold Graphic", "Minimalist Vector", "Hand-Drawn", "Retro Neon", "Y2K"];

function getSloganBadges(entry: RankedSlogan) {
    const badges: { label: string; color: string }[] = [];
    if (entry.bucket === "top") badges.push({ label: "⭐ Elite Pick", color: "emerald" });
    if ((entry.hookScore ?? 0) >= 80) badges.push({ label: "🔥 Viral", color: "orange" });
    if ((entry.emotionalTriggerScore ?? 0) >= 65) badges.push({ label: "❤️ Emotion", color: "rose" });
    if ((entry.wearability ?? 0) >= 85) badges.push({ label: "👕 Wearable", color: "blue" });
    if ((entry.marketSignalScore ?? 0) >= 40) badges.push({ label: "💰 Market", color: "amber" });
    return badges;
}

function badgeClass(color: string) {
    if (color === "emerald") return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25";
    if (color === "orange") return "bg-orange-500/15 text-orange-300 border border-orange-500/25";
    if (color === "rose") return "bg-rose-500/15 text-rose-300 border border-rose-500/25";
    if (color === "blue") return "bg-blue-500/15 text-blue-300 border border-blue-500/25";
    return "bg-amber-500/15 text-amber-300 border border-amber-500/25";
}

function ScoreBar({ value }: { value: number }) {
    const pct = Math.min(100, Math.max(0, value));
    const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-500";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-black text-white tabular-nums w-6 text-right">{Math.round(pct)}</span>
        </div>
    );
}

function SloganCard({ entry, imagePrompt }: { entry: RankedSlogan; imagePrompt?: string }) {
    const [copied, setCopied] = useState(false);
    const [promptCopied, setPromptCopied] = useState(false);
    const [promptOpen, setPromptOpen] = useState(false);
    const badges = getSloganBadges(entry);

    const copySlogan = () => {
        navigator.clipboard.writeText(entry.slogan);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    const copyPrompt = () => {
        if (!imagePrompt) return;
        navigator.clipboard.writeText(imagePrompt);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 1500);
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-4 flex flex-col gap-3">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-white leading-snug">{entry.slogan}</p>
                    {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {badges.map((b, i) => (
                                <span key={i} className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${badgeClass(b.color)}`}>
                                    {b.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={copySlogan}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            {/* Score bar */}
            <ScoreBar value={entry.score} />

            {/* Mini metrics */}
            <div className="flex flex-wrap gap-1.5">
                {entry.wearability !== undefined && (
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        Wear {entry.wearability}
                    </span>
                )}
                {entry.hookScore !== undefined && (
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        Hook {Math.round(entry.hookScore)}
                    </span>
                )}
                {entry.punch !== undefined && (
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        Punch {entry.punch}
                    </span>
                )}
                {entry.visualFit !== undefined && (
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        Visual {Math.round(entry.visualFit)}
                    </span>
                )}
                {entry.pattern && (
                    <span className="px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                        {entry.pattern}
                    </span>
                )}
            </div>

            {/* Reasons */}
            {Array.isArray(entry.reasons) && entry.reasons.length > 0 && (
                <div className="space-y-0.5 pt-1 border-t border-gray-800/60">
                    {entry.reasons.slice(0, 2).map((r, i) => (
                        <div key={i} className="text-[10px] text-gray-400 flex items-start gap-1">
                            <span className="text-emerald-500 shrink-0 mt-0.5">→</span>
                            <span>{r}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Image prompt */}
            {imagePrompt && (
                <div className="border-t border-gray-800/60 pt-2">
                    <button
                        type="button"
                        onClick={() => setPromptOpen((p) => !p)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-200 transition-colors w-full"
                    >
                        {promptOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {promptOpen ? "Hide" : "Show"} Image Prompt
                    </button>
                    {promptOpen && (
                        <div className="mt-2 bg-gray-950 border border-gray-800 rounded-xl p-3 text-[11px] text-gray-300 leading-relaxed font-mono whitespace-pre-wrap relative">
                            {imagePrompt}
                            <button
                                type="button"
                                onClick={copyPrompt}
                                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[10px] font-bold text-gray-300 hover:text-white transition-colors"
                            >
                                {promptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                {promptCopied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default function DesignStudioPage() {
    const { generateSingleStrategy, isLoading, error } = useFactory();
    const [niche, setNiche] = useState("");
    const [audience, setAudience] = useState("");
    const [style, setStyle] = useState("Vintage Distressed");
    const [platform, setPlatform] = useState("amazon");
    const [result, setResult] = useState<any | null>(null);

    // Restore persisted state on mount
    useEffect(() => {
        try {
            const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (saved.niche) setNiche(saved.niche);
            if (saved.audience) setAudience(saved.audience);
            if (saved.style) setStyle(saved.style);
            if (saved.platform) setPlatform(saved.platform);
            if (saved.result) setResult(saved.result);
        } catch (_) { /* ignore corrupt data */ }
    }, []);

    // Persist state whenever it changes
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ niche, audience, style, platform, result }));
            }
        } catch (_) { /* ignore storage errors */ }
    }, [niche, audience, style, platform, result]);

    const allSlogans = useMemo<RankedSlogan[]>(() => {
        if (!result) return [];
        const fromCollections = [
            ...(result.sloganCollections?.topPicks ?? []),
            ...(result.sloganCollections?.boldPicks ?? []),
            ...(result.sloganCollections?.experimental ?? []),
        ].filter((s: any) => s?.slogan) as RankedSlogan[];
        if (fromCollections.length > 0) return fromCollections;
        return Array.isArray(result.sloganInsights)
            ? (result.sloganInsights as RankedSlogan[]).filter((s) => s?.slogan)
            : [];
    }, [result]);

    // Extract niche-specific descriptions from server-generated prompts (style-neutral)
    const serverDescMap = useMemo<Record<string, string>>(() => {
        const map: Record<string, string> = {};
        if (!result || !Array.isArray(result.shirtSlogans) || !Array.isArray(result.imagePrompts)) return map;
        (result.shirtSlogans as string[]).forEach((s: string, i: number) => {
            const raw: unknown = result.imagePrompts[i];
            if (!s || typeof raw !== "string") return;
            // Extract the description after the em-dash on the Style line
            const match = raw.match(/Style:\s*[^\u2014\n]+\u2014\s*(.+?)(?:\.?\s*(?:\n|$))/i)
                ?? raw.match(/Style:\s*[^\-\n]+-\s*(.+?)(?:\.?\s*(?:\n|$))/i);
            if (match?.[1]?.trim()) map[s] = match[1].trim();
        });
        return map;
    }, [result]);

    // Reactive: covers ALL slogans, rebuilds whenever style changes
    const imagePromptMap = useMemo<Record<string, string>>(() => {
        const map: Record<string, string> = {};
        const nicheLabel = niche.trim() || "this niche";
        for (const entry of allSlogans) {
            const desc =
                serverDescMap[entry.slogan] ??
                `A bold commercial t-shirt composition with niche-specific supporting graphics and a clear typographic focal point for ${nicheLabel}`;
            map[entry.slogan] = [
                "Create an original POD t-shirt design.",
                `Text: "${entry.slogan}"`,
                `Style: ${style} \u2014 ${desc.replace(/\.?$/, ".")}`,
                "No brands, logos, or trademarks.",
                "Transparent background.",
                "Commercial friendly.",
                "300 DPI.",
            ].join("\n");
        }
        return map;
    }, [allSlogans, style, niche, serverDescMap]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!niche.trim()) return;
        const data = await generateSingleStrategy(niche.trim(), platform, audience, style);
        if (data) setResult(data);
    };

    return (
        <div className="w-full max-w-5xl px-4 sm:px-8 py-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Zap className="w-8 h-8 text-pink-400" />
                    Slogan Intelligence Engine
                </h1>
                <p className="text-gray-400 mt-2">
                    Score and rank POD slogans using the elite engine — winner badges, pattern analysis, and sell-signal insights.
                </p>
            </header>

            <AiUsageWidget />

            {/* Input form */}
            <form onSubmit={handleGenerate} className="mb-8 p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Niche / Concept *</label>
                    <textarea
                        required
                        rows={2}
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="e.g. Sarcastic introverted raccoons who love coffee…"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none transition-all"
                    />
                </div>

                {/* Style quick-picks */}
                <div className="flex flex-wrap gap-2">
                    {PRESET_STYLES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStyle(s)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-full border transition-colors ${
                                style === s
                                    ? "bg-pink-500/20 border-pink-500/60 text-pink-300"
                                    : "bg-gray-100/5 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Platform</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                            <option value="amazon">Amazon Merch</option>
                            <option value="etsy">Etsy</option>
                            <option value="redbubble">Redbubble</option>
                            <option value="shopify">Shopify / General</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Audience</label>
                        <input
                            type="text"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="e.g. Gen Z college students"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Style Override</label>
                        <input
                            type="text"
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            placeholder="e.g. Retro 90s Neon"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !niche.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    {isLoading ? "Running Elite Engine…" : "Generate & Score Slogans"}
                </button>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </form>

            {result && (
                <div className="space-y-8">
                    {/* Decision + market overview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800">
                            <div className="text-gray-500 font-semibold uppercase mb-1">Decision</div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                result.decision === "PUBLISH" ? "bg-emerald-500 text-emerald-50" :
                                result.decision === "SKIP" ? "bg-red-500 text-red-50" :
                                "bg-yellow-400 text-yellow-950"
                            }`}>
                                {result.decision === "PUBLISH" ? "🟢 SELL NOW" : result.decision === "SKIP" ? "🔴 SKIP" : "🟡 TEST"}
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800">
                            <div className="text-gray-500 font-semibold uppercase mb-1">Niche Score</div>
                            <div className="text-2xl font-black text-white">{result.niche_score ?? "—"}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800">
                            <div className="text-gray-500 font-semibold uppercase mb-1">Top Slogan Score</div>
                            <div className="text-2xl font-black text-white">{result.sloganInsights?.[0]?.score ?? "—"}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800">
                            <div className="text-gray-500 font-semibold uppercase mb-1">Best Seller Score</div>
                            <div className="text-2xl font-black text-amber-300">{result.bestSellerPredictor?.score ?? "—"}
                                <span className="text-xs font-bold text-gray-500 ml-1">{result.bestSellerPredictor?.confidence}</span>
                            </div>
                        </div>
                    </div>

                    {/* Why It Sells */}
                    {result.whyItSells && (
                        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
                            <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Why This Sells</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{result.whyItSells}</p>
                            {result.emotionalTrigger && (
                                <p className="mt-2 text-sm text-gray-400">
                                    <span className="text-emerald-400 font-medium">Emotional Trigger:</span> {result.emotionalTrigger}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Slogan Lab */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm font-black">✦</span>
                                Slogan Lab
                            </h2>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                {allSlogans.length} ranked by elite engine
                            </span>
                        </div>

                        {allSlogans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allSlogans.map((entry, i) => (
                                    <SloganCard
                                        key={i}
                                        entry={entry}
                                        imagePrompt={imagePromptMap[entry.slogan]}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>

                    {/* Design Directions */}
                    {Array.isArray(result.designDirections) && result.designDirections.length > 0 && (
                        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
                            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest">Design Directions</h3>
                            <ul className="space-y-2">
                                {(result.designDirections as string[]).map((d, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-pink-400 shrink-0 font-black mt-0.5">{i + 1}.</span>
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
