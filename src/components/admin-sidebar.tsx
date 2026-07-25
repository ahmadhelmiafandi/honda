
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Car,
    TicketPercent,
    MessageSquareQuote,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth-action";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Unit Mobil", href: "/admin/cars", icon: Car },
    { name: "Promo & Banner", href: "/admin/promos", icon: TicketPercent },
    { name: "Testimoni", href: "/admin/testimonials", icon: MessageSquareQuote },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* ═══ DESKTOP SIDEBAR ═══ */}
            <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto z-50 flex-col border-r border-slate-800 hidden md:flex">
                <div className="px-6 py-8">
                    <Link href="/" className="flex items-center gap-2 group" target="_blank">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            AUTO<span className="text-blue-500">ADMIN</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-grow px-3 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-blue-500")} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-white/5">
                    <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-500 hover:bg-white/5 hover:text-white transition-all font-medium text-sm mb-1">
                        <ExternalLink className="h-4 w-4" />
                        Lihat Website
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium text-sm"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* ═══ MOBILE TOP BAR ═══ */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-[55] bg-slate-900 border-b border-slate-800 h-14 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Car className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-base tracking-tight text-white">
                        AUTO<span className="text-blue-500">ADMIN</span>
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </header>

            {/* ═══ MOBILE DRAWER ═══ */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
                    <div className="absolute top-14 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <nav className="p-3 space-y-1">
                            {MENU_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
                                        <span className="font-semibold text-sm">{item.name}</span>
                                        {isActive && <ChevronRight className="h-4 w-4 opacity-50 ml-auto" />}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-3 border-t border-white/5 flex gap-2">
                            <Link href="/" target="_blank" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all font-semibold text-sm">
                                <ExternalLink className="h-4 w-4" />
                                Website
                            </Link>
                            <button
                                onClick={() => { setMobileOpen(false); logout(); }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-semibold text-sm"
                            >
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ MOBILE BOTTOM NAV ═══ */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 flex items-center">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all",
                                isActive ? "text-blue-400" : "text-slate-600 hover:text-slate-400"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-400" : "text-slate-600")} />
                            <span className={cn("text-[9px] font-bold uppercase tracking-tight", isActive ? "text-blue-400" : "text-slate-600")}>
                                {item.name.split(' ')[0]}
                            </span>
                            {isActive && <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
