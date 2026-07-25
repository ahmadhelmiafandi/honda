
import { PrismaClient } from '@prisma/client';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const prisma = new PrismaClient();
const backupFile = path.join(process.cwd(), 'prisma', 'dev_backup_20260216_205916.db');
const db = new sqlite3.Database(backupFile);
const dbAll = promisify(db.all).bind(db);

async function migrate() {
    console.log('🚀 Memulai migrasi dari backup SQLite ke Neon Postgres...');

    try {
        // 1. Migrate Settings
        const settings = await dbAll('SELECT * FROM Setting') as any[];
        console.log(`- Memindahkan ${settings.length} settings...`);
        for (const s of settings) {
            await prisma.setting.upsert({
                where: { key: s.key },
                update: { value: s.value },
                create: { id: s.id, key: s.key, value: s.value }
            });
        }

        // 2. Migrate Sales
        const sales = await dbAll('SELECT * FROM Sales') as any[];
        console.log(`- Memindahkan ${sales.length} data sales...`);
        for (const s of sales) {
            await prisma.sales.upsert({
                where: { id: s.id },
                update: { name: s.name, photo: s.photo, whatsapp: s.whatsapp, isActive: !!s.isActive },
                create: { id: s.id, name: s.name, photo: s.photo, whatsapp: s.whatsapp, isActive: !!s.isActive }
            });
        }

        // 3. Migrate Cars
        const cars = await dbAll('SELECT * FROM Car') as any[];
        console.log(`- Memindahkan ${cars.length} unit mobil...`);
        for (const c of cars) {
            await prisma.car.upsert({
                where: { id: c.id },
                update: {
                    name: c.name,
                    slug: c.slug,
                    brand: c.brand,
                    price: c.price,
                    status: c.status,
                    badge: c.badge,
                    thumbnail: c.thumbnail,
                    gallery: c.gallery,
                    interiorGallery: c.interiorGallery,
                    videoUrl: c.videoUrl,
                    catalogUrl: c.catalogUrl,
                    description: c.description,
                    specDefinitions: c.specDefinitions,
                    colors: c.colors,
                    isActive: !!c.isActive,
                    isFeatured: !!c.isFeatured
                },
                create: {
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    brand: c.brand,
                    price: c.price,
                    status: c.status,
                    badge: c.badge,
                    thumbnail: c.thumbnail,
                    gallery: c.gallery,
                    interiorGallery: c.interiorGallery,
                    videoUrl: c.videoUrl,
                    catalogUrl: c.catalogUrl,
                    description: c.description,
                    specDefinitions: c.specDefinitions,
                    colors: c.colors,
                    isActive: !!c.isActive,
                    isFeatured: !!c.isFeatured
                }
            });
        }

        // 4. Migrate CarVariants
        const variants = await dbAll('SELECT * FROM CarVariant') as any[];
        console.log(`- Memindahkan ${variants.length} varian mobil...`);
        for (const v of variants) {
            await prisma.carVariant.upsert({
                where: { id: v.id },
                update: {
                    name: v.name,
                    price: v.price,
                    specs: v.specs,
                    colors: v.colors,
                    carId: v.carId
                },
                create: {
                    id: v.id,
                    name: v.name,
                    price: v.price,
                    specs: v.specs,
                    colors: v.colors,
                    carId: v.carId
                }
            });
        }

        // 5. Migrate Promotions
        const promotions = await dbAll('SELECT * FROM Promotion') as any[];
        console.log(`- Memindahkan ${promotions.length} promo...`);
        for (const p of promotions) {
            await prisma.promotion.upsert({
                where: { id: p.id },
                update: {
                    title: p.title,
                    description: p.description,
                    image: p.image,
                    link: p.link,
                    tag: p.tag,
                    period: p.period,
                    isActive: !!p.isActive
                },
                create: {
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    image: p.image,
                    link: p.link,
                    tag: p.tag,
                    period: p.period,
                    isActive: !!p.isActive
                }
            });
        }

        // 6. Migrate Testimonials
        const testimonials = await dbAll('SELECT * FROM Testimonial') as any[];
        console.log(`- Memindahkan ${testimonials.length} testimoni...`);
        for (const t of testimonials) {
            await prisma.testimonial.upsert({
                where: { id: t.id },
                update: {
                    image: t.image,
                    name: t.name,
                    text: t.text,
                    isActive: !!t.isActive
                },
                create: {
                    id: t.id,
                    image: t.image,
                    name: t.name,
                    text: t.text,
                    isActive: !!t.isActive
                }
            });
        }

        console.log('✅ Migrasi Selesai! Semua data backup telah dipindahkan ke Neon Postgres.');
    } catch (error) {
        console.error('❌ Gagal melakukan migrasi:', error);
    } finally {
        db.close();
        await prisma.$disconnect();
    }
}

migrate();
