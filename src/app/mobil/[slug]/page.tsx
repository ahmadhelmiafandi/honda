
// Production Build Fix - Syncing with Vercel
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarBySlug, getSettings } from "@/lib/store";
import {
    ChevronRight,
} from "lucide-react";
import { Metadata } from "next";
import { UnitNavigation } from "./unit-navigation";
import { UnitDetailsClient } from "./unit-details-client";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    const car = await getCarBySlug(slug);

    if (!car) {
        return {
            title: "Unit Tidak Ditemukan",
        }
    }

    const title = `${car.name} 2026 - Harga OTR, Spesifikasi & Simulasi Kredit | Dealer Honda`;
    const description = `Dapatkan ${car.name} terbaru 2026 dengan promo DP Murah & Bunga Rendah. ${car.description?.substring(0, 140)}`;

    return {
        title,
        description,
        keywords: `${car.name}, harga ${car.name}, kredit ${car.name}, promo ${car.name}, spesifikasi ${car.name}, dealer honda`,
        openGraph: {
            title,
            description,
            images: [car.thumbnail],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [car.thumbnail],
        }
    }
}

export default async function CarDetail({ params }: Props) {
    const { slug } = await params;
    const car = await getCarBySlug(slug);

    if (!car) {
        notFound();
    }

    const settingsData = await getSettings();
    const settings = settingsData.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
    const whatsappNumber = settings.whatsapp_number || "6285863162206";

    // Product Schema (Schema.org for Google Search Rich Snippet)
    const jsonLdProduct = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": car.name,
        "image": [car.thumbnail],
        "description": car.description,
        "brand": {
            "@type": "Brand",
            "name": "Honda"
        },
        "offers": {
            "@type": "Offer",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hondaautoland.com'}/mobil/${car.slug}`,
            "priceCurrency": "IDR",
            "price": car.price,
            "availability": car.status === "Ready Stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            "seller": {
                "@type": "AutoDealer",
                "name": settings.site_name || "Honda Autoland"
            }
        }
    };

    // Parse JSON strings for global data
    const colors = JSON.parse(car.colors || "[]");
    return (
        <div className="bg-white min-h-screen pb-32 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
            />
            {/* 1. CINEMATIC HERO */}
            <section id="overview" className="relative h-[60vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
                {/* Background Car Image */}
                <div className="absolute inset-0 z-0 opacity-40">
                    {car.thumbnail ? (
                        <Image
                            src={car.thumbnail}
                            alt={`${car.name} Lifestyle`}
                            fill
                            className="object-cover scale-110 blur-sm"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-4xl space-y-8 text-center md:text-left">
                        <h1 className="text-4xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                            THE ALL NEW <br /> <span className="text-red-600">{car.name}</span>
                        </h1>
                        <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium leading-relaxed mx-auto md:mx-0">
                            Nikmati kombinasi sempurna antara performa legendaris Honda dan teknologi masa depan yang menginspirasi setiap perjalanan Anda.
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-[10px] font-bold uppercase tracking-[0.3em] pt-4 overflow-x-auto no-scrollbar whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <Link href="/" className="text-white/30 hover:text-white transition-colors">Home</Link>
                                <ChevronRight className="h-3 w-3 text-white/20" />
                                <Link href="/mobil" className="text-white/30 hover:text-white transition-colors">Mobil</Link>
                                <ChevronRight className="h-3 w-3 text-white/20" />
                                <span className="text-red-500">{car.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. UNIT NAVIGATION */}
            <UnitNavigation carName={car.name} whatsappNumber={whatsappNumber} />

            {/* 3. DYNAMIC CONTENT CONTAINER (Includes Showcase & Visualizer) */}
            <UnitDetailsClient
                car={car}
                variants={car.variants.map((v: any) => ({
                    id: v.id,
                    name: v.name,
                    price: v.price,
                    colors: v.colors,
                    specs: v.specs
                }))}
                globalColors={colors}
                whatsappNumber={whatsappNumber}
                catalogUrl={(car as any).catalogUrl || settings.global_catalog_url}
            />

            {/* 5. INTERIOR EXPERIENCE - Gallery Section */}
            <section id="interior" className="py-24 bg-slate-950 text-white overflow-hidden border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="space-y-4 max-w-2xl text-center md:text-left">
                            <div className="inline-block bg-red-600/20 text-red-500 text-[10px] font-black tracking-[0.3em] uppercase py-2 px-6 rounded-full border border-red-600/30">
                                Interior Experience
                            </div>
                            <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
                                KENYAMANAN <span className="text-red-600">TANPA BATAS</span>
                            </h2>
                            <p className="text-slate-400 font-medium text-sm md:text-lg">
                                Masuki ruang kabin yang dirancang secara ergonomis dengan material premium untuk memberikan pengalaman berkendara kelas atas.
                            </p>
                        </div>
                    </div>

                    {/* Horizontal Scroll Gallery */}
                    <div className="flex gap-6 overflow-x-auto no-scrollbar -mx-6 px-6 pb-12 snap-x snap-mandatory">
                        {(car as any).interiorGallery && JSON.parse((car as any).interiorGallery).length > 0 ? (
                            JSON.parse((car as any).interiorGallery).map((imgUrl: string, i: number) => (
                                <div key={i} className="min-w-[320px] md:min-w-[700px] aspect-[16/10] relative rounded-[3rem] overflow-hidden group snap-center border border-white/10 shadow-2xl">
                                    <Image
                                        src={imgUrl}
                                        alt={`${car.name} Interior ${i + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                                </div>
                            ))
                        ) : (
                            [
                                { title: "Dashboard Visionary", subtitle: "Advanced Technology", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200" },
                                { title: "Premium Seating", subtitle: "Maximum Comfort", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200" },
                                { title: "Smart Console", subtitle: "Intuitive Control", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200" },
                                { title: "Panoramic View", subtitle: "Open Atmosphere", img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200" }
                            ].map((item, i) => (
                                <div key={i} className="min-w-[320px] md:min-w-[700px] aspect-[16/10] relative rounded-[3rem] overflow-hidden group snap-center border border-white/10 shadow-2xl">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                                    <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-xs font-black uppercase tracking-[0.4em] text-red-500">{item.subtitle}</p>
                                        <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">{item.title}</h3>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 6. DESCRIPTION & LEGACY */}
            <section id="legacy" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="space-y-8">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-600">The Power of Dreams</span>
                        <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
                            {car.name} <span className="text-red-600">DNA</span>
                        </h3>
                        <div className="w-24 h-2 bg-red-600 mx-auto rounded-full" />
                        <p className="text-slate-600 text-base md:text-2xl leading-relaxed font-medium md:text-center px-4 max-w-3xl mx-auto italic">
                            "{car.description}"
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
