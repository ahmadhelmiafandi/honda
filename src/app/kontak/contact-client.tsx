"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Instagram,
    Facebook,
    Send,
    MessageCircle,
    User
} from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { cn, cleanPhoneNumber } from "@/lib/utils";
import { useState } from "react";
import { logLead } from "@/actions/leads";
import Link from "next/link";

interface ContactClientProps {
    settings: Record<string, string>;
}

export default function ContactClient({ settings }: ContactClientProps) {
    const whatsappNumber = settings.whatsapp_number || "6285863162206";
    // Override old seed address if present
    const rawAddress = settings.address;
    const isOldAddress = rawAddress === "Jl. Raya Otomotif No. 88, Jakarta Selatan" || rawAddress === "Kelapa Gading, Jakarta Utara, Indonesia";
    const address = (rawAddress && !isOldAddress) ? rawAddress : "Honda Autoland Kelapa Gading, Jl. Boulevard Bar. Raya No.3, RW.5, Klp. Gading";
    const email = settings.email || "hondaachmad@gmail.com";
    const instagram = settings.instagram_url || "#";
    const facebook = settings.facebook_url || "#";
    const contactName = settings.contact_name || "Achmad";
    const contactTitle = settings.contact_title || "Senior Consultant";
    const contactBadge = settings.contact_badge || "Elite Specialist";
    const contactPhoto = settings.contact_photo;

    // Form States
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (!name || !message) {
            alert("Mohon lengkapi Nama dan Pesan Anda.");
            return;
        }

        const text = `*New Website Inquiry*\n\nNama: ${name}\nNo HP: ${phone || "-"}\nPesan: ${message}`;
        const url = `https://wa.me/${cleanPhoneNumber(whatsappNumber)}?text=${encodeURIComponent(text)}`;

        // Log the lead
        logLead({ type: "CONTACT_FORM_SUBMISSION" });

        // Open WhatsApp
        window.open(url, "_blank");
    };

    const handleInstantWhatsApp = () => {
        const text = `Halo ${contactName}, saya ingin informasi lebih lanjut mengenai unit Honda terbaru.`;
        const url = `https://wa.me/${cleanPhoneNumber(whatsappNumber)}?text=${encodeURIComponent(text)}`;

        logLead({ type: "CONTACT_INSTANT_WA" });
        window.open(url, "_blank");
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
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

    const heroBadge = settings?.contact_hero_badge || "Personal Assistance";
    const heroTitle = settings?.contact_hero_title || "Contact";
    const heroHighlight = settings?.contact_hero_highlight || "Us";
    const heroDesc = settings?.contact_hero_desc || "Terhubung langsung dengan spesialis kami untuk pengalaman pembelian yang personal dan eksklusif.";
    const heroImage = settings?.contact_hero_image || "https://images.unsplash.com/photo-1626880299881-28564177d949?q=80&w=2000";

    return (
        <div className="bg-white min-h-screen pb-20 md:pb-32 overflow-x-hidden">
            {/* Hero Section: Consistent with Homepage */}
            <section className="relative h-[60vh] md:h-[75vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-white z-10" />
                    <Image
                        src={heroImage}
                        alt="Contact Expertise"
                        fill
                        className="object-cover opacity-60 scale-105"
                        priority
                        sizes="100vw"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-20 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-10 mx-auto">
                            <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                            <span className="text-[10px] text-white/80 uppercase tracking-[0.4em] font-bold">
                                {heroBadge}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-white uppercase">
                            {heroTitle} <span className="text-red-600">{heroHighlight}</span>
                        </h1>
                        <p className="text-white/50 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
                            {heroDesc}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 -mt-10 md:-mt-20 pb-20 md:pb-40 relative z-30">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] space-y-8">
                            {/* Representative */}
                            <div className="flex gap-4 items-center">
                                <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 shadow-xl overflow-hidden relative">
                                    {contactPhoto ? (
                                        <Image src={contactPhoto} alt={contactName} fill className="object-cover" />
                                    ) : (
                                        <User className="h-8 w-8 text-white" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] mb-1">{contactBadge}</p>
                                    <p className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{contactName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{contactTitle}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Phone, label: "Direct Call", val: whatsappNumber, color: "text-slate-900 hover:text-red-600", bg: "bg-slate-50", action: () => window.open(`tel:${cleanPhoneNumber(whatsappNumber)}`), nowrap: true },
                                    { icon: Mail, label: "Official Email", val: email, color: "text-slate-900 hover:text-red-600", bg: "bg-slate-50", action: () => window.open(`mailto:${email}`), nowrap: false },
                                    { icon: MessageCircle, label: "Live WhatsApp", val: "Chat Now", color: "text-green-600 hover:text-green-700", bg: "bg-green-50/50", action: handleInstantWhatsApp, nowrap: true }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer items-center" onClick={item.action}>
                                        <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110", item.bg)}>
                                            <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className={cn(
                                                "text-base md:text-lg font-black tracking-tight uppercase",
                                                item.color,
                                                item.nowrap ? "whitespace-nowrap" : "break-all text-sm md:text-base"
                                            )}>{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10 border-t border-slate-100 flex gap-4">
                                <a
                                    href={instagram}
                                    target="_blank"
                                    className="h-14 w-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all duration-500"
                                >
                                    <Instagram className="h-6 w-6" />
                                </a>
                                <a
                                    href={facebook}
                                    target="_blank"
                                    className="h-14 w-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all duration-500"
                                >
                                    <Facebook className="h-6 w-6" />
                                </a>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-10 rounded-2xl text-white space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl opacity-20" />
                            <div className="flex items-center gap-4 relative z-10">
                                <Clock className="h-6 w-6 text-red-600" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Service Hours</h3>
                            </div>
                            <div className="space-y-4 relative z-10">
                                {[
                                    { days: "Mon - Fri", hours: "08:00 - 20:00" },
                                    { days: "Saturday", hours: "08:00 - 18:00" },
                                    { days: "Sunday", hours: "09:00 - 17:00" }
                                ].map((time, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{time.days}</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">{time.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form and Map */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-6 md:p-16 rounded-2xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
                            <div className="mb-12">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Exclusive Inquiry</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ceritakan kebutuhan otomotif Anda kepada kami</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <Input
                                        placeholder="YOUR NAME..."
                                        className="h-16 rounded-xl border-slate-100 bg-slate-50 px-8 text-xs font-bold uppercase tracking-[0.2em] placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-red-600/10 transition-all shadow-none"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Contact</label>
                                    <Input
                                        placeholder="YOUR NUMBER..."
                                        className="h-16 rounded-xl border-slate-100 bg-slate-50 px-8 text-xs font-bold uppercase tracking-[0.2em] placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-red-600/10 transition-all text-sm shadow-none"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 mb-12">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
                                <textarea
                                    className="w-full min-h-[180px] rounded-xl border-slate-100 bg-slate-50 p-8 text-xs font-bold uppercase tracking-[0.2em] placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-red-600/10 outline-none transition-all resize-none shadow-inner"
                                    placeholder="HOW CAN WE ASSIST YOU TODAY?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Button
                                    onClick={handleSendMessage}
                                    className="h-16 bg-slate-900 hover:bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-500 gap-4"
                                >
                                    Send Message
                                    <Send className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={handleInstantWhatsApp}
                                    className="h-16 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-500 gap-4 shadow-xl shadow-red-600/10"
                                >
                                    Instant WhatsApp
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Premium Map Wrapper */}
                        {/* Premium Map Wrapper */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group border border-slate-100">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=Honda+Autoland+Kelapa+Gading&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}
