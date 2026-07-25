import { getSettings, getPromotions } from "@/lib/store";
import PromoClient from "./client-page";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Promo & Diskon Mobil Honda Terbaru 2026 | DP Ringan & Bunga 0%",
    description: "Dapatkan paket promo spesial mobil Honda bulan ini. Promo DP Murah mulai 10%, bunga 0%, cashback maksimal, dan bonus aksesoris melimpah hanya di Honda Autoland.",
    keywords: "promo honda 2026, promo dp murah honda, diskon honda brio, promo honda hrv, cashback mobil honda, promo cicilan 0%",
};

export default async function PromoPage() {
    const promos = await getPromotions();
    const settingsData = await getSettings();
    const settings = settingsData.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});

    return <PromoClient promos={promos} settings={settings} />;
}

