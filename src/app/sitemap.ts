import { MetadataRoute } from 'next';
import { getCars } from '@/lib/store';

export const revalidate = 86400; // Revalidate every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hondaautoland.com';

  let cars: any[] = [];
  try {
    cars = await getCars();
  } catch (e) {
    console.error("Sitemap getCars error:", e);
  }

  const carUrls = cars.map((car) => ({
    url: `${baseUrl}/mobil/${car.slug}`,
    lastModified: car.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/mobil',
    '/promo',
    '/testimoni',
    '/tentang',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9,
  }));

  return [...routes, ...carUrls];
}
