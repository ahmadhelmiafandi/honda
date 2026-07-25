import { getCars, getSettings } from "@/lib/store";
import MobilListingClient from "./client-page";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Katalog Mobil Honda Terbaru 2026 | Harga OTR & Spesifikasi Lengkap",
    description: "Cek daftar harga OTR terbaru mobil Honda 2026: Honda Brio, HR-V, CR-V, Civic RS, City Hatchback, WR-V. Lengkap dengan spesifikasi, pilihan warna, dan simulasi kredit.",
    keywords: "katalog honda, harga mobil honda, honda brio 2026, honda hrv 2026, honda crv turbo, honda civic rs, spesifikasi honda",
};

export default async function MobilListing() {
    const cars = await getCars();
    const settingsData = await getSettings();
    const settings = settingsData.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});

    return (
        <MobilListingClient initialCars={cars} settings={settings} />
    );
}

