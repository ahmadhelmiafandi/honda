
"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoSectionProps {
    url?: string;
    titleMain?: string;
    titleHighlight?: string;
    description?: string;
}

export function VideoSection({
    url,
    titleMain,
    titleHighlight,
    description
}: VideoSectionProps) {
    // If url is empty string or undefined, use a default fallback
    const videoUrl = (url && url.trim() !== "") ? url : "https://www.youtube.com/watch?v=F_fPQu3-u8k";
    const displayTitleMain = (titleMain && titleMain.trim() !== "") ? titleMain : "Product & Event";
    const displayTitleHighlight = (titleHighlight && titleHighlight.trim() !== "") ? titleHighlight : "Highlights";
    const displayDescription = (description && description.trim() !== "") ? description : "Saksikan kemeriahan event terbaru kami dan review eksklusif produk Honda pilihan yang siap menemani perjalanan Anda.";

    // Extract Video ID from various YouTube URL formats
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);
    if (!videoId) return null;

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="h-px w-8 bg-red-600" />
                            <p className="text-[10px] uppercase tracking-[0.4em] text-red-600 font-black">Video Review</p>
                            <span className="h-px w-8 bg-red-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                            {displayTitleMain} <span className="text-red-600">{displayTitleHighlight}</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            {displayDescription}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative aspect-video w-full max-w-5xl mx-auto rounded-[32px] overflow-hidden shadow-2xl shadow-red-900/10 border border-white/5 bg-slate-900"
                >
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />

                    {/* Decorative Frame */}
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[32px]" />
                </motion.div>

                <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                <Play className="h-5 w-5 text-red-600 fill-red-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">High Quality</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-white">4K</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Experience</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
