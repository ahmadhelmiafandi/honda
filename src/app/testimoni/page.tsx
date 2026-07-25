
import { getTestimonials, getSettings } from "@/lib/store";
import TestimonialClient from "./client-page";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Testimoni & Serah Terima Unit Pelanggan | Honda Autoland",
    description: "Galeri foto bahagia serah terima unit mobil Honda pelanggan kami. Bukti kepuasan layanan profesional, proses cepat, dan harga terbaik di Honda Autoland.",
    keywords: "testimoni honda autoland, serah terima mobil honda, bukti kepuasan pelanggan honda",
};

export default async function TestimonialPage() {
    const testimonials = await getTestimonials();
    const settings = await getSettings();

    const settingsObj = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    return <TestimonialClient testimonials={testimonials as any} settings={settingsObj} />;
}

