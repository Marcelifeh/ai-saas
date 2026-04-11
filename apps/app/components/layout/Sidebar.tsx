"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Compass,
    Factory,
    Rocket,
    BarChart,
    Settings,
    Palette,
    LogOut,
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const links = [
        { name: "Strategy Factory", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-500" },
        { name: "Trend Discovery", href: "/discovery", icon: Compass, color: "text-purple-500" },
        { name: "Bulk Factory", href: "/factory", icon: Factory, color: "text-yellow-500" },
        { name: "Slogan Intelligence", href: "/design-studio", icon: Palette, color: "text-pink-500" },
        { name: "Autopilot", href: "/autopilot", icon: Rocket, color: "text-emerald-500" },
        { name: "Analytics", href: "/analytics", icon: BarChart, color: "text-indigo-500" },
        { name: "Settings", href: "/settings", icon: Settings, color: "text-gray-400" },
    ];

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex h-screen sticky top-0">
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-transparent">
                        <Image
                            src="/trendforge-logo.png"
                            alt="TrendForge AI logo"
                            fill
                            priority
                            sizes="40px"
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-white tracking-tight">TrendForge AI</h2>
                        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Turn trends into revenue.</span>
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 px-2">Workspace</p>

                <nav className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActive
                                        ? "bg-gray-800 text-white shadow-lg"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? link.color : "currentColor"}`} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
                <div className="bg-[#151c2f] p-4 rounded-xl border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-emerald-500 opacity-20"></div>
                    <div className="flex items-center gap-3">
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt="avatar"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner text-xs font-bold">
                                {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-black leading-tight tracking-tight truncate">
                                {session?.user?.name ?? "Signed In"}
                            </div>
                            <div className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-0.5 truncate">
                                {session?.user?.email ?? ""}
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            title="Sign out"
                            className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
