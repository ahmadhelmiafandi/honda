
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout";
import { getSettings } from "@/lib/store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const s = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteName = s.site_name ? `${s.site_name} ${s.site_name_highlight || ''}` : "Honda Autoland";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hondaautoland.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: s.meta_title || `${siteName} | Dealer Resmi Mobil Honda 2026, Harga OTR & Promo Kredit`,
      template: `%s | ${siteName}`,
    },
    description: s.meta_description || "Dealer Resmi Mobil Honda Indonesia. Dapatkan penawaran promo Honda Brio, HR-V, CR-V, Civic RS terbaru 2026. DP Murah, Angsuran Ringan, Kredit 100% Approve & Siap Kirim.",
    keywords: [
      "dealer resmi honda",
      "promo honda 2026",
      "harga honda brio",
      "harga honda hr-v",
      "harga honda cr-v",
      "harga honda civic rs",
      "kredit mobil honda",
      "dp murah honda",
      "dealer honda jakarta",
      "autoland honda",
      "simulasi kredit honda"
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: siteUrl,
      title: s.meta_title || `${siteName} | Dealer Resmi Mobil Honda Terbaru 2026`,
      description: s.meta_description || "Dapatkan mobil Honda impian Anda dengan promo terbaik, DP murah, dan proses kredit cepat di Dealer Resmi Honda Autoland.",
      siteName: siteName,
      images: [
        {
          url: s.hero_image_url || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=100&w=1200",
          width: 1200,
          height: 630,
          alt: `${siteName} - Dealer Resmi Honda`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: s.meta_title || `${siteName} | Dealer Resmi Honda`,
      description: s.meta_description || "Promo & Simulasi Kredit Honda Terbaru 2026. DP Ringan & Proses Cepat.",
      images: [s.hero_image_url || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=100&w=1200"],
    },
    alternates: {
      canonical: "./",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const settingsObj = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hondaautoland.com";

  // AutoDealer Schema (Schema.org LocalBusiness)
  const jsonLdDealer = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": settingsObj.site_name ? `${settingsObj.site_name} ${settingsObj.site_name_highlight || ''}` : "Honda Autoland",
    "image": settingsObj.hero_image_url || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200",
    "url": siteUrl,
    "telephone": settingsObj.phone_number || settingsObj.whatsapp_number || "+6285863162206",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settingsObj.address || "Jl. Raya Otomotif No. 88",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "postalCode": "12340",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    "priceRange": "Rp 150.000.000 - Rp 1.200.000.000",
    "sameAs": [
      settingsObj.instagram || "https://instagram.com",
      settingsObj.facebook || "https://facebook.com"
    ]
  };

  // FAQ Schema (Schema.org FAQPage for Google Search Rich Snippets)
  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Berapa DP minimal untuk pembelian mobil Honda?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DP minimal untuk unit Honda mulai dari 10% atau kisaran Rp 15 jutaan untuk tipe Honda Brio, dengan skema kredit yang disesuaikan budget konsumen."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah bisa tukar tambah (Trade-In) mobil lama dengan unit Honda baru?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bisa! Kami melayani tukar tambah semua merk mobil lama dengan jaminan taksiran harga tertinggi dan proses instan."
        }
      },
      {
        "@type": "Question",
        "name": "Berapa lama proses persetujuan kredit mobil Honda?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Proses survey dan persetujuan kredit cepat 1-3 hari kerja dengan bantuan tim konsultan berpengalaman hingga 100% approve."
        }
      }
    ]
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDealer) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} antialiased min-h-screen selection:bg-red-600 selection:text-white`}>
        <ConditionalLayout settings={settingsObj}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}

