import Link from "next/link";

const YEAR = new Date().getFullYear();

export function DashboardFooter() {
  return (
    <footer className="border-t border-gray-800/60 bg-[#0a0a0a] px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs">
            © {YEAR}{" "}
            <span className="text-gray-500 font-semibold">TrendForge AI</span>
            {" "}— All rights reserved.
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5 text-xs text-gray-500">
          <Link
            href="/terms"
            className="hover:text-indigo-400 transition-colors duration-150"
          >
            Terms of Service
          </Link>
          <span className="text-gray-700" aria-hidden>·</span>
          <Link
            href="/privacy"
            className="hover:text-emerald-400 transition-colors duration-150"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-700" aria-hidden>·</span>
          <a
            href="mailto:support@trendforge.ai"
            className="hover:text-white transition-colors duration-150"
          >
            Support
          </a>
        </nav>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          All systems operational
        </div>
      </div>
    </footer>
  );
}
