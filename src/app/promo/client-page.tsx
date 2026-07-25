"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, ChevronRight, Clock, Percent, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { cleanPhoneNumber } from "@/lib/utils";

interface PromoClientProps {
    promos: any[];
    settings: Record<string, string>;
}

export default function PromoClient({ promos, settings }: PromoClientProps) {
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const whatsappNumber = settings.whatsapp_number || "6285863162206";
    const heroBadge = settings.promo_hero_badge || "Exclusive Offers";
    const heroTitle = settings.promo_hero_title || "Premium";
    const heroHighlight = settings.promo_hero_highlight || "Benefits";
    const heroDesc = settings.promo_hero_desc || "Nikmati penawaran eksklusif dan kemudahan terbaik dalam memiliki kendaraan impian Anda.";
    const heroImage = settings.promo_hero_image || "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2000";

    return (
        <div className="bg-white min-h-screen pb-32 overflow-x-hidden text-slate-900">
            {/* Hero Section: Perfectly Aligned with New Brand Style */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-white z-10" />
                    <Image
                        src={heroImage}
                        alt="Promo Background"
                        fill
                        className="object-cover opacity-60 scale-105"
                        priority
                    />
                </div>
                <div className="container mx-auto px-6 relative z-20 text-center mt-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-10 mx-auto">
                            <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse" />
                            <span className="text-[10px] text-white/80 uppercase tracking-[0.4em] font-bold">
                                {heroBadge}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-8xl font-black mb-8 tracking-tighter leading-none text-white uppercase">
                            {heroTitle} <span className="text-red-600">{heroHighlight}</span>
                        </h1>
                        <p className="text-white/50 text-xs md:text-sm font-bold max-w-2xl mx-auto leading-loose uppercase tracking-[0.3em]">
                            {heroDesc}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 -mt-20 pb-40 relative z-30">
                <motion.div
                    className="grid grid-cols-1 gap-16 md:gap-32"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {promos.length > 0 ? (
                        promos.map((promo, i) => (
                            <motion.div
                                key={promo.id}
                                className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-24 items-center group`}
                                variants={fadeInUp}
                            >
                                {/* Left: Image with Premium Frame */}
                                <div className="flex-1 w-full relative aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 group">
                                    <Image
                                        src={promo.image}
                                        alt={promo.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        unoptimized
                                    />
                                    <div className="absolute top-8 left-8">
                                        <Badge className="bg-red-600/90 backdrop-blur-md text-white border-none font-bold px-6 py-3 text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-2xl">
                                            {promo.tag || "Promo Terbaru"}
                                        </Badge>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Right: Content */}
                                <div className="flex-1 space-y-8 w-full">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-red-600">
                                            <div className="h-0.5 w-12 bg-red-600" />
                                            <div className="text-[10px] font-black uppercase tracking-[0.4em]">Limited Timing Offer</div>
                                        </div>
                                        <h2 className="text-2xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase break-words">
                                            {promo.title}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-red-600">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Masa Berlaku</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">{promo.period || "Berlaku Bulan Ini"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-red-600">
                                                <Gift className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Benefit</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Rewards Ready</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 font-medium text-lg leading-relaxed border-l-4 border-slate-100 pl-6">
                                        {promo.description}
                                    </p>

                                    <div className="pt-6">
                                        <Link
                                            href={`https://wa.me/${cleanPhoneNumber(whatsappNumber)}?text=Halo,%20saya%20tertarik%20dengan%20promo:%20${encodeURIComponent(promo.title)}`}
                                            target="_blank"
                                        >
                                            <Button className="w-full sm:w-auto bg-slate-950 hover:bg-red-600 text-white h-16 px-12 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 gap-4 group shadow-2xl shadow-slate-900/10 hover:shadow-red-600/20">
                                                Ambil Penawaran Sekarang
                                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
                            <Percent className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Belum ada promo aktif saat ini.</p>
                            <Link href="/mobil">
                                <Button variant="link" className="mt-4 text-red-600 font-bold uppercase tracking-widest text-[10px]">Lihat Katalog Unit</Button>
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Newsletter Section: Premium Refinement */}
                <motion.div
                    className="mt-40 relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 md:p-32 text-center text-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mx-auto">
                                <Clock className="h-3 w-3 text-red-600" />
                                <span className="text-[9px] uppercase tracking-widest font-black">Stay Updated</span>
                            </div>
                            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none">Don't <span className="text-red-600">Miss Out</span></h2>
                            <p className="text-white/40 font-medium text-lg leading-relaxed uppercase tracking-widest">Dapatkan update promo terbaru langsung ke WhatsApp Anda.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-xl mx-auto pt-6">
                            <input
                                placeholder="WHATSAPP NUMBER..."
                                className="flex-grow h-16 rounded-2xl bg-white/5 border border-white/10 px-8 text-[10px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-red-600/50 outline-none transition-all placeholder:text-white/10"
                            />
                            <Button className="bg-red-600 hover:bg-red-700 text-white font-black px-10 h-16 rounded-2xl text-[10px] uppercase tracking-widest transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)]">
                                Subscribe Now
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
