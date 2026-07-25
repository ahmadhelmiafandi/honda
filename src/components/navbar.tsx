"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { cn, cleanPhoneNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HondaLogo } from "@/components/ui/honda-logo";

import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { name: "Beranda", href: "/" },
    { name: "Katalog", href: "/mobil" },
    { name: "Testimoni", href: "/testimoni" },
    { name: "Promo", href: "/promo" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Kontak", href: "/kontak" },
];

export function Navbar({ settings }: { settings?: Record<string, string> }) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const siteName = settings?.site_name || "Honda";
    const highlight = settings?.site_name_highlight || "Autoland";
    const whatsapp = settings?.whatsapp_number || "6285863162206";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                isScrolled
                    ? "py-2 md:py-3"
                    : "py-4 md:py-6 pt-[env(safe-area-inset-top)]"
            )}
        >
            <div className="w-full px-4 md:px-12">
                <div className={cn(
                    "flex items-center justify-between transition-all duration-700 h-16 md:h-20 rounded-2xl md:rounded-[2rem] border",
                    isScrolled
                        ? "bg-white/90 backdrop-blur-2xl border-slate-200/50 shadow-lg px-4 md:px-8"
                        : "bg-slate-900/40 backdrop-blur-md border-white/10 px-5"
                )}>
                    {/* Mobile Branding & Toggle */}
                    <div className="flex lg:hidden items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            {settings?.site_logo || settings?.site_logo_light ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={(!isScrolled ? settings.site_logo_light : settings.site_logo) || settings.site_logo || settings.site_logo_light}
                                    alt={settings?.site_name || "Logo"}
                                    className={cn(
                                        "h-11 w-auto max-w-[200px] object-contain",
                                        !isScrolled && !settings?.site_logo_light && "brightness-0 invert"
                                    )}
                                />
                            ) : (
                                <>
                                    <HondaLogo className={cn("h-7 w-7 transition-colors duration-500", isScrolled ? "text-red-600" : "text-white")} />
                                    <span className={cn(
                                        "font-black text-[13px] tracking-tighter uppercase leading-none",
                                        isScrolled ? "text-slate-900" : "text-white"
                                    )}>
                                        {siteName}<span className="text-red-600">{highlight}</span>
                                    </span>
                                </>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn(
                                "h-11 w-11 flex items-center justify-center transition-all duration-500 rounded-xl border",
                                isScrolled
                                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                    : "bg-white/10 border-white/20 text-white backdrop-blur-sm"
                            )}
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Desktop Logo */}
                    <Link href="/" className="hidden lg:flex items-center gap-3 group">
                        {settings?.site_logo || settings?.site_logo_light ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={(!isScrolled ? settings.site_logo_light : settings.site_logo) || settings.site_logo || settings.site_logo_light}
                                alt={settings?.site_name || "Logo"}
                                className={cn(
                                    "h-11 w-auto max-w-[200px] object-contain",
                                    !isScrolled && !settings?.site_logo_light && "brightness-0 invert"
                                )}
                            />
                        ) : (
                            <HondaLogo className={cn("h-8 w-8 transition-colors duration-500", isScrolled ? "text-red-600" : "text-white group-hover:text-red-600")} />
                        )}
                        <span className={cn(
                            "font-black text-lg tracking-tighter transition-colors duration-500 uppercase",
                            isScrolled ? "text-slate-900" : "text-white",
                            (settings?.site_logo || settings?.site_logo_light) ? "hidden" : "block"
                        )}>
                            {siteName}<span className="text-red-600">{highlight}</span>
                        </span>
                    </Link>

                    {/* Navigation: Minimalist spacing */}
                    <div className="hidden lg:flex items-center gap-10">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2",
                                        isScrolled
                                            ? (isActive ? "text-red-600" : "text-slate-500 hover:text-slate-900")
                                            : (isActive ? "text-white" : "text-white/50 hover:text-white")
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions: Integrated design */}
                    <div className="hidden lg:flex items-center">
                        <Link href={`https://wa.me/${cleanPhoneNumber(whatsapp)}`} target="_blank">
                            <Button
                                className={cn(
                                    "rounded h-10 px-8 font-bold text-[10px] uppercase tracking-widest transition-all duration-500",
                                    isScrolled
                                        ? "bg-slate-900 text-white hover:bg-red-600"
                                        : "bg-white text-slate-900 hover:bg-red-600 hover:text-white"
                                )}
                            >
                                Contact Specialist
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Toggle removed and integrated to header above */}
                </div>
            </div>

            {/* Mobile Overlay: Premium fullscreen feel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] lg:hidden bg-white/10 backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-y-0 right-0 w-[85%] bg-slate-950 flex flex-col shadow-2xl"
                        >
                            {/* Gradient Background Decoration */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-slate-900 pointer-events-none" />

                            <div className="flex justify-between items-center p-8 pt-[calc(2rem+env(safe-area-inset-top))] relative z-10">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
                                    {settings?.site_logo || settings?.site_logo_light ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={settings.site_logo_light || settings.site_logo}
                                            alt={settings?.site_name || "Logo"}
                                            className={cn(
                                                "h-7 w-auto object-contain",
                                                !settings?.site_logo_light && "brightness-0 invert"
                                            )}
                                        />
                                    ) : (
                                        <HondaLogo className="h-6 w-6 text-red-600" />
                                    )}
                                    <span className={cn(
                                        "font-black text-xs tracking-tighter uppercase text-white",
                                        (settings?.site_logo || settings?.site_logo_light) ? "hidden" : "block"
                                    )}>
                                        {siteName}<span className="text-red-600">{highlight}</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-4 relative z-10">
                                <nav className="space-y-4">
                                    {NAV_LINKS.map((link, i) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "block py-4 border-b border-white/5 transition-all",
                                                    pathname === link.href
                                                        ? "text-4xl font-black text-red-600 tracking-tighter"
                                                        : "text-3xl font-bold text-white/60 hover:text-white tracking-tighter"
                                                )}
                                            >
                                                {link.name}
                                                {pathname === link.href && (
                                                    <span className="inline-block ml-4 h-2 w-2 rounded-full bg-red-600" />
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-8 relative z-10 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connect with Us</p>
                                        <Link href={`https://wa.me/${cleanPhoneNumber(whatsapp)}`} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 gap-3 group">
                                                <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                WhatsApp Consultant
                                            </Button>
                                        </Link>
                                    </div>
                                    <p className="text-[9px] text-center text-slate-600 font-medium uppercase tracking-[0.3em]">
                                        Honda Autoland © {new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
