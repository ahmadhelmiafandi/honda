
"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Promotion } from "@/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cleanPhoneNumber } from "@/lib/utils";

interface PromoPopupProps {
    promotions: Promotion[];
    whatsappNumber?: string;
}

export function PromoPopup({ promotions, whatsappNumber }: PromoPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPromo, setCurrentPromo] = useState<Promotion | null>(null);

    useEffect(() => {
        if (!promotions || promotions.length === 0) return;

        const hasBeenShown = sessionStorage.getItem("promo_popup_shown");
        if (hasBeenShown) return;

        const timer = setTimeout(() => {
            const activePromo = promotions.find(p => p.isActive);
            if (activePromo) {
                setCurrentPromo(activePromo);
                setIsOpen(true);
                sessionStorage.setItem("promo_popup_shown", "true");
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [promotions]);

    if (!currentPromo) return null;

    const whatsapp = cleanPhoneNumber(whatsappNumber || "6285863162206");

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popup Container — aware of top bar (56px mobile) and bottom nav (~65px) */}
                    <div className="fixed inset-x-0 z-[9995] flex items-center justify-center px-4"
                        style={{
                            top: '64px',   /* below top navbar */
                            bottom: '72px', /* above bottom nav */
                        }}
                    >
                        <motion.div
                            key="popup"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-[400px] bg-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col"
                            style={{ maxHeight: '100%' }}
                        >
                            {/* Scrollable inner content */}
                            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '100%' }}>
                                {/* Image Section */}
                                <div className="relative flex-shrink-0" style={{ aspectRatio: '2.4/1' }}>
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-3 right-3 z-50 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/20"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>

                                    {currentPromo.image ? (
                                        <Image
                                            src={currentPromo.image}
                                            alt={currentPromo.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <span className="text-slate-300 font-black text-xl uppercase tracking-widest">Promotion</span>
                                        </div>
                                    )}

                                    {currentPromo.tag && (
                                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                                            {currentPromo.tag}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="h-px w-4 bg-red-600" />
                                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.3em]">Penawaran Spesial</p>
                                            </div>
                                            <h2 className="text-lg font-black text-slate-900 leading-tight tracking-tight uppercase line-clamp-2">
                                                {currentPromo.title}
                                            </h2>
                                            {currentPromo.period && (
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-2.5 py-0.5 rounded-full border border-slate-100 italic">
                                                    Berlaku: {currentPromo.period}
                                                </p>
                                            )}
                                        </div>

                                        {currentPromo.description && (
                                            <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2">
                                                {currentPromo.description}
                                            </p>
                                        )}

                                        <div className="flex flex-col gap-2 pt-1">
                                            <Link
                                                href={currentPromo.link || `https://wa.me/${whatsapp}?text=Halo, saya tertarik dengan promo: ${currentPromo.title}`}
                                                target="_blank"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Button className="w-full bg-slate-900 hover:bg-red-600 text-white font-black h-11 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group text-sm">
                                                    Ambil Promo Sekarang
                                                    <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`https://wa.me/${whatsapp}?text=Halo, saya ingin tanya-tanya tentang promo: ${currentPromo.title}`}
                                                target="_blank"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-bold h-9 rounded-lg transition-all flex items-center justify-center gap-2 text-xs">
                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                    Tanya Sales Honda
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
