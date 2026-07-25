
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const defaultVideo = "https://www.youtube.com/watch?v=F_fPQu3-u8k";

    console.log("Setting default video values...");

    await prisma.setting.upsert({
        where: { key: 'home_video_url' },
        update: { value: defaultVideo },
        create: { key: 'home_video_url', value: defaultVideo }
    });

    await prisma.setting.upsert({
        where: { key: 'home_video_title_main' },
        update: { value: 'Product & Event' },
        create: { key: 'home_video_title_main', value: 'Product & Event' }
    });

    await prisma.setting.upsert({
        where: { key: 'home_video_title_highlight' },
        update: { value: 'Highlights' },
        create: { key: 'home_video_title_highlight', value: 'Highlights' }
    });

    await prisma.setting.upsert({
        where: { key: 'home_video_description' },
        update: { value: 'Saksikan kemeriahan event terbaru kami dan review eksklusif produk Honda pilihan yang siap menemani perjalanan Anda.' },
        create: { key: 'home_video_description', value: 'Saksikan kemeriahan event terbaru kami dan review eksklusif produk Honda pilihan yang siap menemani perjalanan Anda.' }
    });

    console.log("✅ Success! Video section is now active with default content.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
