"use client";

import { useEffect } from "react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Dashboard error]", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl">
                ⚠
            </div>
            <div>
                <h2 className="text-lg font-bold text-white mb-1">Something went wrong</h2>
                <p className="text-sm text-gray-400 max-w-sm">
                    An unexpected error occurred. If this persists, please contact support.
                </p>
            </div>
            <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
