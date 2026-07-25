
import { getSettings } from "@/lib/store";
import AboutClient from "./client-page";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Tentang Kami - Dealer Resmi Honda Autoland",
    description: "Mengenal Dealer Resmi Honda Autoland. Menghadirkan standar kualitas pelayanan Honda terbaik, jaminan unit ready stock, serta fasilitas purna jual terlengkap.",
    keywords: "tentang dealer honda, profil honda autoland, dealer resmi honda terpercaya",
};

export default async function AboutPage() {
    const settingsData = await getSettings();
    const settings = settingsData.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});

    return (
        <AboutClient settings={settings} />
    );
}

