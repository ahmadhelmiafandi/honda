
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const newPhone = "+62 858-6316-2206";
    const newWa = "6285863162206";

    console.log("Starting update process...");

    try {
        console.log("Updating whatsapp_number...");
        await prisma.setting.upsert({
            where: { key: 'whatsapp_number' },
            update: { value: newWa },
            create: { key: 'whatsapp_number', value: newWa }
        });

        console.log("Updating phone_number...");
        await prisma.setting.upsert({
            where: { key: 'phone_number' },
            update: { value: newPhone },
            create: { key: 'phone_number', value: newPhone }
        });

        console.log("Checking Sales staff...");
        const count = await prisma.sales.count();
        console.log(`Found ${count} sales staff.`);

        if (count > 0) {
            console.log("Updating sales staff numbers...");
            await prisma.sales.updateMany({
                data: {
                    whatsapp: newWa
                }
            });
        }

        console.log("✅ Success! Phone and WhatsApp numbers have been updated to +62 858-6316-2206.");
    } catch (error: any) {
        console.error("❌ Error during update:", error.message);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error("FATAL:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
