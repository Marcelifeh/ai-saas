"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";

export interface UserVisualStyle {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

interface CustomStyleSelectorProps {
    value: string;
    onChange: (style: string) => void;
    selectedPreset?: string;
    disabled?: boolean;
    storageKey?: string;
}

const MAX_NAME_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 1200;
const CUSTOM_DIRECTION_MARKER = "USER-SUPPLIED VISUAL DIRECTION:";

function normalizeWhitespace(value: string): string {
    return value
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function createId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `style_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Builds one neutral, free-form style value without cataloguing known aesthetics. */
export function buildCustomVisualStyle(name: string, description: string): string {
    const cleanName = normalizeWhitespace(name).slice(0, MAX_NAME_LENGTH);
    const cleanDescription = normalizeWhitespace(description).slice(0, MAX_DESCRIPTION_LENGTH);
    if (!cleanName && !cleanDescription) return "";
    if (!cleanDescription) return cleanName;
    if (!cleanName) return cleanDescription;
    return `${cleanName}\n\n${CUSTOM_DIRECTION_MARKER}\n${cleanDescription}`;
}

export function resolveVisualStyle(customStyle: string, presetStyle: string): string {
    return customStyle.trim() || presetStyle.trim() || "Bold Graphic";
}

function splitCustomVisualStyle(value: string): { name: string; description: string } {
    const [name = "", description = ""] = value.split(`\n\n${CUSTOM_DIRECTION_MARKER}\n`, 2);
    return { name: name.trim(), description: description.trim() };
}

function parseStoredStyles(value: string | null): UserVisualStyle[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((item): item is UserVisualStyle => (
                Boolean(item) &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                typeof item.description === "string" &&
                typeof item.createdAt === "string"
            ))
            .slice(0, 50);
    } catch {
        return [];
    }
}

export default function CustomStyleSelector({
    value,
    onChange,
    selectedPreset,
    disabled = false,
    storageKey = "trendforge:user-visual-styles:v1",
}: CustomStyleSelectorProps) {
    const [styleName, setStyleName] = useState("");
    const [styleDescription, setStyleDescription] = useState("");
    const [savedStyles, setSavedStyles] = useState<UserVisualStyle[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            setSavedStyles(parseStoredStyles(window.localStorage.getItem(storageKey)));
        } catch {
            setSavedStyles([]);
        } finally {
            setLoaded(true);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!loaded) return;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(savedStyles));
        } catch {
            // Local persistence is optional and must never break Design Studio.
        }
    }, [loaded, savedStyles, storageKey]);

    useEffect(() => {
        if (!value.trim() || styleName || styleDescription) return;
        const restored = splitCustomVisualStyle(value);
        setStyleName(restored.name);
        setStyleDescription(restored.description);
    }, [styleDescription, styleName, value]);

    const resolvedCustomStyle = useMemo(
        () => buildCustomVisualStyle(styleName, styleDescription),
        [styleName, styleDescription],
    );
    const isActive = Boolean(value.trim());

    function updateName(nextName: string) {
        setStyleName(nextName);
        if (isActive) onChange(buildCustomVisualStyle(nextName, styleDescription));
    }

    function updateDescription(nextDescription: string) {
        setStyleDescription(nextDescription);
        if (isActive) onChange(buildCustomVisualStyle(styleName, nextDescription));
    }

    function applyCurrentStyle() {
        if (resolvedCustomStyle) onChange(resolvedCustomStyle);
    }

    function saveCurrentStyle() {
        const cleanName = normalizeWhitespace(styleName).slice(0, MAX_NAME_LENGTH);
        const cleanDescription = normalizeWhitespace(styleDescription).slice(0, MAX_DESCRIPTION_LENGTH);
        if (!cleanName) return;
        const comparableName = cleanName.toLocaleLowerCase();
        setSavedStyles((previous) => {
            const existingIndex = previous.findIndex(
                (item) => item.name.trim().toLocaleLowerCase() === comparableName,
            );
            if (existingIndex >= 0) {
                return previous.map((item, index) => index === existingIndex
                    ? { ...item, name: cleanName, description: cleanDescription }
                    : item);
            }
            return [...previous, {
                id: createId(),
                name: cleanName,
                description: cleanDescription,
                createdAt: new Date().toISOString(),
            }].slice(-50);
        });
        onChange(buildCustomVisualStyle(cleanName, cleanDescription));
    }

    function selectSavedStyle(style: UserVisualStyle) {
        setStyleName(style.name);
        setStyleDescription(style.description);
        onChange(buildCustomVisualStyle(style.name, style.description));
    }

    function deleteSavedStyle(id: string, event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setSavedStyles((previous) => previous.filter((item) => item.id !== id));
    }

    function clearCustomStyle() {
        setStyleName("");
        setStyleDescription("");
        onChange("");
    }

    return (
        <section className="mt-4 rounded-xl border border-gray-700/70 bg-gray-950/55 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-100">Custom Style</h3>
                        {isActive && (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                Active
                            </span>
                        )}
                    </div>
                    <p className="mt-1 max-w-3xl text-xs leading-5 text-gray-400">
                        Use any new or emerging visual aesthetic. TrendForge interprets the supplied direction dynamically through the existing design engine.
                    </p>
                </div>
                {selectedPreset && !isActive && (
                    <span className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-400">
                        Preset: {selectedPreset}
                    </span>
                )}
            </div>

            <div className="mt-4 grid gap-3">
                <div>
                    <label htmlFor="custom-style-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Style name
                    </label>
                    <input
                        id="custom-style-name"
                        type="text"
                        value={styleName}
                        disabled={disabled}
                        maxLength={MAX_NAME_LENGTH}
                        onChange={(event) => updateName(event.target.value)}
                        placeholder="e.g. Vintage Folk Art Linocut"
                        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div>
                    <div className="mb-1.5 flex justify-between gap-3">
                        <label htmlFor="custom-style-description" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Visual direction <span className="normal-case tracking-normal text-gray-600">(optional)</span>
                        </label>
                        <span className="text-[10px] text-gray-600">{styleDescription.length}/{MAX_DESCRIPTION_LENGTH}</span>
                    </div>
                    <textarea
                        id="custom-style-description"
                        value={styleDescription}
                        disabled={disabled}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        rows={4}
                        onChange={(event) => updateDescription(event.target.value)}
                        placeholder="Describe the visual language, composition, typography, palette, texture, linework, motifs, or print treatment."
                        className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={disabled || !resolvedCustomStyle} onClick={applyCurrentStyle} className="rounded-lg bg-pink-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-40">
                        Use Custom Style
                    </button>
                    <button type="button" disabled={disabled || !normalizeWhitespace(styleName)} onClick={saveCurrentStyle} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40">
                        Save Style
                    </button>
                    {(styleName || styleDescription || value) && (
                        <button type="button" disabled={disabled} onClick={clearCustomStyle} className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-400 transition hover:text-white disabled:opacity-40">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {savedStyles.length > 0 && (
                <div className="mt-5 border-t border-gray-800 pt-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Your saved styles</p>
                    <div className="flex flex-wrap gap-2">
                        {savedStyles.map((savedStyle) => {
                            const styleValue = buildCustomVisualStyle(savedStyle.name, savedStyle.description);
                            const selected = value.trim() === styleValue.trim();
                            return (
                                <div key={savedStyle.id} className="inline-flex overflow-hidden rounded-lg border border-gray-700">
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        title={savedStyle.description || savedStyle.name}
                                        onClick={() => selectSavedStyle(savedStyle)}
                                        className={`px-3 py-2 text-xs font-semibold transition ${selected ? "bg-pink-600 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"}`}
                                    >
                                        {savedStyle.name}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        aria-label={`Delete ${savedStyle.name}`}
                                        onClick={(event) => deleteSavedStyle(savedStyle.id, event)}
                                        className="border-l border-gray-700 bg-gray-950 px-2 text-gray-600 transition hover:bg-red-950/40 hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
