"use client";

import { useState, useRef } from "react";
import { Hero } from "@/components/hero";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Award, Zap, ChevronLeft, ChevronRight, Clock, Banknote, HeartHandshake, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import type { Car, Testimonial, Promotion } from "@/types";
import { PromoPopup } from "@/components/promo-popup";
import { VideoSection } from "@/components/video-section";
import { cleanPhoneNumber } from "@/lib/utils";

interface HomePageClientProps {
    featuredCars: Car[];
    settings?: Record<string, string>;
    testimonials?: Testimonial[];
    promotions?: Promotion[];
}

const HONDA_FEATURES = [
    {
        icon: Clock,
        title: "Proses Cepat & Mudah",
        description: "Data dibantu sampai approve. Proses kredit fleksibel, transparan, dan tanpa ribet. Unit ready stock siap kirim.",
        color: "red",
    },
    {
        icon: Banknote,
        title: "Harga Terbaik",
        description: "Dapatkan penawaran termurah dengan diskon maksimal, hitungan kredit termurah, dan bonus aksesoris melimpah.",
        color: "blue",
    },
    {
        icon: HeartHandshake,
        title: "Layanan Prioritas",
        description: "Konsultasi unit 24 jam, test drive diantar ke rumah, dan layanan aftersales seumur hidup untuk ketenangan Anda.",
        color: "purple",
    },
];

// Animation variants
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
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function HomePageClient({ featuredCars, settings, testimonials, promotions }: HomePageClientProps) {
    // Car Slider State
    const carSliderRef = useRef<HTMLDivElement>(null);
    const [currentCarSlide, setCurrentCarSlide] = useState(0);

    // Testimonial Slider State
    const testimonialRef = useRef<HTMLDivElement>(null);

    const handleCarScroll = () => {
        const container = carSliderRef.current;
        if (!container || featuredCars.length === 0) return;

        const scrollLeft = container.scrollLeft;
        const cards = Array.from(container.children) as HTMLElement[];

        let closestIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, index) => {
            // Calculate distance between card position and scroll container's left edge
            // 16 is the px-4 padding compensation
            const distance = Math.abs(card.offsetLeft - 16 - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        setCurrentCarSlide(closestIndex);
    };

    const scrollCar = (direction: "left" | "right") => {
        const container = carSliderRef.current;
        if (!container || featuredCars.length === 0) return;

        const nextIndex = direction === "left" ? currentCarSlide - 1 : currentCarSlide + 1;
        if (nextIndex < 0 || nextIndex >= featuredCars.length) return;

        const targetCard = container.children[nextIndex] as HTMLElement;
        if (targetCard) {
            container.scrollTo({
                left: targetCard.offsetLeft - 16,
                behavior: "smooth"
            });
        }
    };

    // Generic Scroll for Testimonials (Simple)
    const scrollTestimonial = (direction: "left" | "right") => {
        const container = testimonialRef.current;
        if (!container) return;

        const scrollAmount = 320; // Approx card width
        const currentScroll = container.scrollLeft;

        container.scrollTo({
            left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
            behavior: "smooth"
        });
    };

    return (
        <div className="flex flex-col bg-white overflow-x-hidden">
            <Hero settings={settings} promotions={promotions} />



            {/* Unit Ready Stock: Sales-Focused */}
            <section className="py-12 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="mb-10 md:mb-16 text-center space-y-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold">
                                {settings?.ready_stock_badge || "Honda Terbaru 2026"}
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                {settings?.ready_stock_title_main || "Unit"} <span className="text-red-600">{settings?.ready_stock_title_highlight || "Ready Stock"}</span>
                            </h2>
                            <p className="text-slate-500 text-sm max-w-xl mx-auto">
                                {settings?.ready_stock_description || "Proses cepat, harga terbaik, unit siap kirim"}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Link href="/mobil">
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold h-12 px-8 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-red-600/20"
                                >
                                    {settings?.ready_stock_cta || "Tanya Harga Terbaik"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Slider Component */}
                    <div className="relative group/slider">
                        <div
                            ref={carSliderRef}
                            onScroll={handleCarScroll}
                            className="flex gap-4 md:gap-6 overflow-x-auto pb-8 md:pb-12 snap-x snap-mandatory no-scrollbar px-4 -mx-4"
                        >
                            {featuredCars.map((car) => (
                                <div key={car.id} className="w-[85vw] md:w-[500px] lg:w-[550px] snap-center flex-shrink-0">
                                    <CarCard car={car} whatsappNumber={settings?.whatsapp_number} />
                                </div>
                            ))}

                            {featuredCars.length === 0 && (
                                <div className="w-full py-20 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-400 font-semibold uppercase tracking-widest text-sm">
                                        Tidak Ada Unit
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Clean Slider Navigation */}
                        <div className="flex flex-col items-center gap-6 mt-8 md:mt-12">
                            <div className="flex items-center gap-8">
                                <button
                                    className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
                                    onClick={() => scrollCar("left")}
                                    disabled={currentCarSlide === 0}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-lg font-semibold text-slate-900 tabular-nums">
                                        {currentCarSlide + 1} <span className="text-slate-300 mx-1">/</span> {featuredCars.length || 0}
                                    </span>
                                    {/* Progress Line */}
                                    <div className="w-20 h-[2px] bg-slate-200 rounded-full overflow-hidden relative">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-red-600"
                                            initial={false}
                                            animate={{
                                                width: `${((currentCarSlide + 1) / (featuredCars.length || 1)) * 100}%`
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
                                    onClick={() => scrollCar("right")}
                                    disabled={currentCarSlide === featuredCars.length - 1}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section: Why Choose Us */}
            <section className="py-12 md:py-24 bg-slate-50 text-slate-900 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        className="max-w-3xl mx-auto text-center mb-12 md:mb-20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4 font-bold">
                            Kenapa Memilih Kami
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900">
                            {settings?.features_title_main || "Solusi Kredit"} <span className="text-red-600">{settings?.features_title_highlight || "Terbaik"}</span>
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                            {settings?.features_description || "Dapatkan mobil impian dengan proses anti ribet, harga termurah, dan pelayanan bintang lima."}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {HONDA_FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            // Dynamic overrides from settings
                            const title = settings?.[`feature_${index + 1}_title`] || feature.title;
                            const desc = settings?.[`feature_${index + 1}_desc`] || feature.description;

                            return (
                                <motion.div
                                    key={index}
                                    className="p-6 md:p-10 rounded-2xl bg-white border border-slate-100 hover:border-red-100 hover:shadow-xl hover:shadow-red-600/5 transition-all duration-500 group"
                                    variants={fadeInUp}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-500">
                                        <Icon className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-slate-900">
                                        {title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section >

            {/* About Section: Trusted Partner */}
            <section className="py-12 md:py-24 bg-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 skew-x-12 translate-x-32 -z-10" />

                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 group"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={scaleIn}
                        >
                            <Image
                                src={settings?.about_image_url || "https://images.unsplash.com/photo-1626084209322-a5e2d14d3c90?q=80&w=2560"}
                                alt="Honda Precision Showroom"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                quality={100}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Sales Badge */}

                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="space-y-10"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="h-[2px] w-12 bg-red-600 block" />
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                                        {settings?.about_badge || "DEALER RESMI HONDA"}
                                    </p>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                                    {settings?.about_title_main || "Wujudkan Mobil"} <br /> <span className="text-red-600">{settings?.about_title_highlight || "Impian Anda"}</span>
                                </h2>
                                <p className="text-slate-500 text-lg leading-relaxed border-l-4 border-red-100 pl-6">
                                    {settings?.about_description || "Dapatkan unit Honda terbaru dengan penawaran eksklusif. Kami siap membantu proses kepemilikan mobil Anda menjadi mudah, cepat, dan menyenangkan."}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Stok Terlengkap & Ready",
                                        desc: "Pilihan unit terbanyak, warna lengkap, siap kirim hari ini ke garasi Anda."
                                    },
                                    {
                                        title: "Jaminan Harga Termurah",
                                        desc: "Nego sampai deal! Dapatkan diskon maksimal dan bonus aksesoris melimpah."
                                    },
                                    {
                                        title: "Proses Kredit 100% Approve",
                                        desc: "Dibantu sales profesional berpengalaman, data kurang kami bantu sampai lolos."
                                    }
                                ].map((item, i) => {
                                    const index = i + 1;
                                    const title = settings?.[`about_point_${index}_title`] || item.title;
                                    const desc = settings?.[`about_point_${index}_desc`] || item.desc;

                                    return (
                                        <div key={i} className="flex gap-5 group">
                                            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors duration-300 shadow-sm group-hover:shadow-red-200">
                                                <CheckCircle2 className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
                                                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Link href="/mobil">
                                <Button className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 rounded-full font-bold text-sm transition-all duration-300 shadow-xl shadow-red-600/20 hover:shadow-red-600/40">
                                    Lihat Unit Ready Stock
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Video Highlight: Premium Experience */}
            <VideoSection
                url={settings?.home_video_url}
                titleMain={settings?.home_video_title_main}
                titleHighlight={settings?.home_video_title_highlight}
                description={settings?.home_video_description}
            />

            {/* Testimonials Slider: Happy Customers */}
            {
                testimonials && testimonials.length > 0 && (
                    <section className="py-12 md:py-32 bg-slate-50">
                        <div className="container mx-auto px-6">
                            <motion.div
                                className="text-center mb-10 md:mb-16"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4 font-bold">
                                    Bukti Kepuasan Pelanggan
                                </p>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                                    Ribuan <span className="text-red-600">Cerita Sukses</span>
                                </h2>
                                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                                    Lihat senyum bahagia mereka yang telah mewujudkan mobil impiannya. Proses mudah, cepat, dan transparan. Giliran Anda selanjutnya!
                                </p>
                            </motion.div>

                            <div className="relative group">
                                {/* Navigation Buttons - Hidden on Mobile for cleaner look, swipe is natural */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none flex justify-between px-2 md:-mx-4">
                                    <Button
                                        onClick={() => scrollTestimonial("left")}
                                        variant="outline"
                                        size="icon"
                                        className="hidden md:flex h-12 w-12 rounded-full bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:text-white"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        onClick={() => scrollTestimonial("right")}
                                        variant="outline"
                                        size="icon"
                                        className="hidden md:flex h-12 w-12 rounded-full bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:text-white"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </div>

                                <motion.div
                                    ref={testimonialRef}
                                    className="flex gap-4 md:gap-6 overflow-x-auto pb-8 md:pb-10 scrollbar-hide snap-x no-scrollbar pt-4 -mx-4 px-4"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={staggerContainer}
                                >
                                    {testimonials.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="min-w-[80vw] md:min-w-[400px] snap-center aspect-[4/5] relative rounded-2xl overflow-hidden group shadow-lg md:shadow-xl"
                                            variants={fadeInUp}
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name || "Testimonial"}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 300px, 400px"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-white">
                                                <p className="font-bold text-xl mb-2 text-white uppercase tracking-tighter">{item.name || "Happy Owner"}</p>
                                                <p className="text-xs text-white/80 md:text-white/60 font-medium leading-relaxed italic">{item.text || "Terima kasih atas kepercayaannya!"}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            <motion.div
                                className="mt-8 md:mt-16 text-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link href="/testimoni">
                                    <Button
                                        variant="outline"
                                        className="border-slate-200 hover:border-red-600 font-bold h-12 px-8 rounded-xl text-[10px] uppercase tracking-widest transition-all duration-300 w-full md:w-auto"
                                    >
                                        Lihat Galeri Serah Terima
                                        <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </section>
                )
            }

            {/* Promo Section: Deals & Offers */}
            <section className="py-12 md:py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        className="text-center mb-10 md:mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4 font-bold">
                            {settings?.promo_badge || "Penawaran Spesial"}
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            {settings?.promo_title_main || "Promo"} <span className="text-red-600">{settings?.promo_title_highlight || "Terbatas"}</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            {settings?.promo_description || "Dapatkan penawaran terbaik bulan ini. Stok terbatas, segera hubungi kami sebelum kehabisan."}
                        </p>
                    </motion.div>

                    {promotions && promotions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
                            {promotions.map((promo, index) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-50 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border border-slate-100 flex flex-col"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={promo.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070"}
                                            alt={promo.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            unoptimized
                                        />
                                        {promo.tag && (
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                                                    {promo.tag}
                                                </p>
                                            </div>
                                        )}
                                        {promo.period && (
                                            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                                                <p className="text-[10px] font-bold text-white">
                                                    {promo.period}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                            {promo.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 text-justify flex-1">
                                            {promo.description}
                                        </p>
                                        <Link href={promo.link || `https://wa.me/${cleanPhoneNumber(settings?.whatsapp_number || "")}?text=Halo, saya tertarik dengan promo: ${promo.title}`} target="_blank" className="mt-auto">
                                            <Button className="w-full bg-slate-200 hover:bg-slate-900 text-slate-900 hover:text-white font-bold h-12 rounded-xl transition-all duration-300">
                                                Dapatkan Promo Ini
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200 mb-20 max-w-2xl mx-auto"
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl">🎁</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Promo Saat Ini</h3>
                            <p className="text-slate-500 text-sm">Nantikan penawaran menarik kami selanjutnya. Hubungi kami untuk info stok terbaru.</p>
                        </motion.div>
                    )}

                    {/* Secondary Contact CTA */}
                    <motion.div
                        className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden text-center shadow-2xl shadow-slate-900/20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleIn}
                    >
                        {/* Abstract BG */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{settings?.cta_title || "Butuh Simulasi Kredit?"}</h3>
                            <p className="text-slate-400 mb-10 leading-relaxed text-sm md:text-base">
                                {settings?.cta_description || "Tim spesialis kami siap membantu menghitungkan skema kredit terbaik yang sesuai dengan budget Anda. Konsultasi gratis tanpa syarat."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={`https://wa.me/${cleanPhoneNumber(settings?.whatsapp_number || "6285863162206")}`} target="_blank">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 rounded-full font-bold text-sm tracking-widest transition-all shadow-lg shadow-red-600/20 w-full sm:w-auto">
                                        {settings?.cta_button_primary || "Hubungi Sales"}
                                    </Button>
                                </Link>
                                <Link href="/mobil">
                                    <Button className="bg-white hover:bg-slate-200 text-slate-900 h-14 px-10 rounded-full font-bold text-sm tracking-widest transition-all shadow-lg shadow-white/5 w-full sm:w-auto">
                                        {settings?.cta_button_secondary || "Lihat Unit Ready"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            {promotions && promotions.length > 0 && (
                <PromoPopup promotions={promotions} whatsappNumber={settings?.whatsapp_number} />
            )}
        </div >
    );
}
