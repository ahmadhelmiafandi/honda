import { getSettings } from "@/lib/store";
import ContactClient from "./contact-client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Hubungi Sales Consultant Honda Autoland | Konsultasi 24 Jam",
    description: "Hubungi Sales Consultant resmi Honda untuk simulasi kredit gratis, brosur, test drive di rumah, dan informasi harga OTR promo terbaru bulan ini.",
    keywords: "sales honda, whatsapp dealer honda, konsultasi kredit honda, kontak dealer honda, alamat showroom honda",
};

export default async function ContactPage() {
    const settingsData = await getSettings();
    const settings = settingsData.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    return <ContactClient settings={settings} />;
}




