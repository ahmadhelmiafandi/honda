"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
    ChevronRight,
    Droplets,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "./cta-section";

interface Variant {
    id: string;
    name: string;
    price: number;
    specs?: string; // JSON String
    colors?: string; // JSON String of Names
}

interface Color {
    name: string;
    image: string;
    hex?: string;
}

interface UnitDetailsClientProps {
    car: any;
    variants: Variant[];
    globalColors: Color[];
    whatsappNumber: string;
    catalogUrl?: string;
}

export function UnitDetailsClient({
    car,
    variants,
    globalColors,
    whatsappNumber,
    catalogUrl
}: UnitDetailsClientProps) {
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    const [activeImage, setActiveImage] = useState(car.thumbnail);

    // Sync activeImage whenever selectedColor changes
    useMemo(() => {
        if (selectedColor?.image) {
            setActiveImage(selectedColor.image);
        }
    }, [selectedColor]);

    // Compute prices
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const currentPrice = selectedVariant ? selectedVariant.price : car.price;
    const formattedPrice = formatPrice(currentPrice);

    // Compute colors for the selected variant
    const currentColors = useMemo(() => {
        if (!selectedVariant?.colors) return globalColors;
        try {
            const selectedNames: string[] = JSON.parse(selectedVariant.colors);
            if (selectedNames.length === 0) return globalColors;
            return globalColors.filter(c => selectedNames.includes(c.name));
        } catch {
            return globalColors;
        }
    }, [selectedVariant, globalColors]);

    // Sync selected color
    useMemo(() => {
        setSelectedColor(currentColors[0] || null);
    }, [currentColors]);

    // Gallery images
    const gallery = JSON.parse(car.gallery || "[]");
    const images = gallery.length > 0 ? gallery : [car.thumbnail];

    return (
        <>
            {/* 3. PRODUCT SHOWCASE */}
            <section className="py-16 md:py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        {/* Left: Car Image Showcase */}
                        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                            <div className="relative aspect-video w-full group overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                {activeImage ? (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeImage}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={activeImage}
                                                alt={car.name}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="h-20 w-20 text-slate-200" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* Simple Gallery Grid */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
                                    {images.slice(0, 6).map((img: string, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden border transition-all cursor-pointer group shrink-0 min-w-[70px] md:min-w-0 ${activeImage === img ? 'border-red-600 ring-4 ring-red-600/10' : 'border-slate-100 bg-slate-50 hover:border-red-600'}`}
                                        >
                                            <Image src={img} alt={`${car.name} ${i}`} fill className="object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info Area */}
                        <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                            <div>
                                <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none text-slate-900 mb-6">
                                    {car.name} <br />
                                    <span className="text-red-600 text-2xl md:text-4xl">{selectedVariant?.name}</span>
                                </h2>
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-red-600 hover:bg-red-600 text-white text-[10px] font-black tracking-widest uppercase py-2 px-6 rounded-xl border-none shadow-lg shadow-red-600/20">
                                        {car.status}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                        Premium Edition
                                    </span>
                                </div>
                            </div>

                            {/* Price Area: Glass Card Effect */}
                            <div className="p-8 rounded-[2rem] bg-slate-950 text-white space-y-4 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[60px] -mr-16 -mt-16 group-hover:bg-red-600/40 transition-colors" />
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    {selectedVariant ? `Harga Varian ${selectedVariant.name}` : "Mulai Dari OTR Jakarta"}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">{formattedPrice}</h2>
                                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">*</span>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                    <CheckCircle2 className="h-4 w-4 text-red-500" />
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Harga Estimasi Tidak Mengikat</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6">
                                <CTASection
                                    carId={car.id}
                                    carName={`${car.name} ${selectedVariant?.name || ""}`}
                                    carPrice={currentPrice}
                                    whatsappNumber={whatsappNumber}
                                    catalogUrl={catalogUrl}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE SELECTION - Variants & Colors & Specs */}
            <div className="space-y-32">
                {/* Step 1: Variant Selection */}
                <section className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6">
                        <div className="space-y-2 md:space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-600 text-white text-[10px] md:text-xs font-black italic">1</span>
                                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-red-600">Pilih Varian</h2>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9] md:leading-tight">
                                TIPE <span className="text-slate-400">&</span> PERFORMA
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                        {variants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`relative p-3.5 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all text-left group overflow-hidden flex flex-col justify-between min-h-[90px] md:min-h-0 ${selectedVariant?.id === v.id
                                    ? "border-red-600 bg-white shadow-xl shadow-red-600/5"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                            >
                                {selectedVariant?.id === v.id && (
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 blur-2xl -mr-8 -mt-8" />
                                )}

                                <div className="relative z-10 flex flex-col h-full justify-between gap-2">
                                    <div className="min-w-0">
                                        <h4 className={`text-[9px] md:text-xl font-black uppercase tracking-tight leading-tight line-clamp-2 ${selectedVariant?.id === v.id ? "text-slate-900" : "text-slate-500"}`}>
                                            {v.name}
                                        </h4>
                                        <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-2">Estimasi Harga OTR</p>
                                    </div>

                                    <div className="flex items-baseline gap-0.5">
                                        <p className={`text-[11px] md:text-2xl font-black tracking-tighter ${selectedVariant?.id === v.id ? "text-red-600" : "text-slate-900"}`}>
                                            {formatPrice(v.price)}
                                        </p>
                                        <span className="text-[8px] font-bold text-slate-300">*</span>
                                    </div>
                                </div>

                                <div className="hidden md:flex absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>

                                {selectedVariant?.id === v.id && (
                                    <motion.div
                                        layoutId="variant-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Simple Specs Section - Compact Version */}
                <section id="spesifikasi" className="py-8 bg-slate-50/50 border-y border-slate-100 font-sans">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-6 text-center px-4">
                                <div className="flex items-center justify-center gap-2 mb-1.5">
                                    <ShieldCheck className="h-4 w-4 text-red-600" />
                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Spesifikasi Teknis</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
                                    {selectedVariant?.name || "Detail Unit"}
                                </h2>
                            </div>

                            <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden mx-4 md:mx-0">
                                {(() => {
                                    const rawSpecs = selectedVariant?.specs;
                                    if (!rawSpecs) return (
                                        <div className="text-center py-10">
                                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Belum ada spesifikasi ditambahkan.</p>
                                        </div>
                                    );

                                    let lines: string[] = [];
                                    try {
                                        // Check if it's the old JSON format
                                        if (rawSpecs.trim().startsWith('{')) {
                                            const obj = JSON.parse(rawSpecs);
                                            lines = Object.values(obj).filter(v => typeof v === 'string' && v.trim() !== "") as string[];
                                        } else {
                                            // It's the new plain text format
                                            lines = rawSpecs.split('\n').filter(l => l.trim() !== "");
                                        }
                                    } catch (e) {
                                        lines = rawSpecs.split('\n').filter(l => l.trim() !== "");
                                    }

                                    if (lines.length === 0) return (
                                        <div className="text-center py-10">
                                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Belum ada spesifikasi ditambahkan.</p>
                                        </div>
                                    );

                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                                            {lines.map((line, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 py-1 border-b border-slate-50 group hover:bg-slate-50/30 transition-colors rounded-lg px-2 -mx-2">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                                                    <p className="text-[12px] md:text-[13px] font-medium text-slate-700 leading-snug">
                                                        {line.replace(/^-\s*/, '').replace(/^\*\s*/, '')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Color Selection */}
                <section className="container mx-auto px-6 pb-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-6">
                        <div className="space-y-2 md:space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-600 text-white text-[10px] md:text-xs font-black italic">2</span>
                                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-red-600">Pilih Warna</h2>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9] md:leading-tight">
                                EKSPRESI <span className="text-slate-400">&</span> GAYA
                            </h3>
                        </div>
                        {selectedColor && (
                            <div className="bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 hidden md:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pilihan Anda</p>
                                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{selectedColor.name}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-8 overflow-x-auto no-scrollbar pb-16 -mx-6 px-6 snap-x snap-mandatory">
                        <AnimatePresence mode="popLayout">
                            {currentColors.map((c: Color, i: number) => (
                                <motion.button
                                    key={c.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => setSelectedColor(c)}
                                    className={`min-w-[280px] md:min-w-[450px] rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all duration-500 overflow-hidden shrink-0 group bg-white snap-center relative ${selectedColor?.name === c.name
                                        ? "border-red-600 shadow-2xl shadow-red-600/10 scale-[1.02]"
                                        : "border-slate-100/50 hover:border-slate-200"
                                        }`}
                                >
                                    <div className="aspect-[16/10] relative p-6 md:p-12">
                                        <Image
                                            src={c.image}
                                            alt={c.name}
                                            fill
                                            className="object-contain p-10 md:p-12 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                        />
                                        {c.hex && (
                                            <div className="absolute top-4 left-4 md:top-8 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full" style={{ backgroundColor: c.hex }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`p-6 md:p-10 border-t transition-all duration-500 ${selectedColor?.name === c.name ? "bg-slate-900 border-slate-900" : "bg-white border-slate-100"}`}>
                                        <h4 className={`text-lg md:text-xl font-black uppercase tracking-tight text-center ${selectedColor?.name === c.name ? "text-white" : "text-slate-900"}`}>
                                            {c.name}
                                        </h4>
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <div className={`w-8 h-1 rounded-full transition-all ${selectedColor?.name === c.name ? "w-12 bg-red-600" : "bg-slate-100"}`} />
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>

                        {currentColors.length === 0 && (
                            <div className="w-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Silahkan hubungi sales untuk menanyakan ketersediaan warna</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
