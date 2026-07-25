"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cleanPhoneNumber } from "@/lib/utils";
import type { Promotion } from "@/types";

interface HeroProps {
    settings?: Record<string, string>;
    promotions?: Promotion[];
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0
    })
};

export function Hero({ settings, promotions = [] }: HeroProps) {
    const whatsapp = settings?.whatsapp_number || "6285863162206";

    // Filter active promos
    const activePromos = promotions.filter((p) => p.isActive !== false);

    // Fallback slides if no active promos are available in DB
    const defaultSlides = [
        {
            id: "default-1",
            title: "Promo Special Honda",
            image: settings?.hero_image_url || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=100&w=2560",
            link: `https://wa.me/${cleanPhoneNumber(whatsapp)}`
        },
        {
            id: "default-2",
            title: "Honda Civic RS",
            image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=100&w=2560",
            link: "/mobil"
        },
        {
            id: "default-3",
            title: "Honda HR-V Special Offer",
            image: "https://images.unsplash.com/photo-1619682817481-e99489121b99?q=100&w=2560",
            link: "/promo"
        }
    ];

    const slides = activePromos.length > 0
        ? activePromos.map((p) => ({
            id: p.id,
            title: p.title,
            image: p.image,
            link: p.link || `https://wa.me/${cleanPhoneNumber(whatsapp)}?text=${encodeURIComponent(`Halo, saya tertarik dengan promo: ${p.title}`)}`
        }))
        : defaultSlides;

    const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
    const [isHovered, setIsHovered] = useState(false);

    const currentIndex = Math.abs(page % slides.length);

    const paginate = useCallback((newDirection: number) => {
        setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    }, []);

    // Autoplay slider every 5 seconds (paused on hover)
    useEffect(() => {
        if (slides.length <= 1 || isHovered) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length, isHovered, paginate]);

    const currentSlide = slides[currentIndex];

    return (
        <section className="relative min-h-[88vh] lg:min-h-screen flex flex-col items-center justify-center pt-24 md:pt-28 pb-10 md:pb-16 bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1600px] w-full flex-1 flex flex-col justify-center items-center">
                {/* Hero Banner Slider Container with Fluid Aspect Ratio */}
                <div
                    className="relative w-full aspect-[16/10] sm:aspect-[16/7.5] md:aspect-[21/9] lg:aspect-[2.4/1] max-h-[75vh] md:max-h-[80vh] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl shadow-black/50 group border border-white/10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={page}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {currentSlide.link ? (
                                <Link
                                    href={currentSlide.link}
                                    target={currentSlide.link.startsWith("http") ? "_blank" : "_self"}
                                    className="block w-full h-full relative cursor-pointer"
                                >
                                    <Image
                                        src={currentSlide.image}
                                        alt={currentSlide.title || "Promo Honda"}
                                        fill
                                        className="object-cover object-center"
                                        priority={currentIndex === 0}
                                        unoptimized
                                    />
                                </Link>
                            ) : (
                                <div className="w-full h-full relative">
                                    <Image
                                        src={currentSlide.image}
                                        alt={currentSlide.title || "Promo Honda"}
                                        fill
                                        className="object-cover object-center"
                                        priority={currentIndex === 0}
                                        unoptimized
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Left & Right Navigation Arrows */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={() => paginate(-1)}
                                aria-label="Previous Slide"
                                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-13 md:h-13 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 shadow-lg md:opacity-0 md:group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={() => paginate(1)}
                                aria-label="Next Slide"
                                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-13 md:h-13 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 shadow-lg md:opacity-0 md:group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage([idx, idx > currentIndex ? 1 : -1])}
                                        aria-label={`Go to slide ${idx + 1}`}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            idx === currentIndex
                                                ? "w-7 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"
                                                : "w-2 bg-white/40 hover:bg-white/80"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}


