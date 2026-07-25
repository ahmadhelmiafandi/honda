
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

export async function updateSettingsAction(formData: FormData) {
    const entries = Array.from(formData.entries());
    console.log(`Starting settings update for ${entries.length} fields...`);

    try {
        const updates: Record<string, string> = {};
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

        for (const [key, value] of entries) {
            if (key.startsWith('$')) continue;

            if (value instanceof File && value.size > 0 && value.name !== "undefined") {
                console.log(`Processing file: [${key}] - ${value.name}`);

                // Use Vercel Blob if token is available
                if (blobToken) {
                    const blob = await put(`${key}-${value.name}`, value, {
                        access: 'public',
                        addRandomSuffix: true,
                    });
                    updates[key] = blob.url;
                } else if (process.env.NODE_ENV === 'development') {
                    // Fallback to local filesystem ONLY in development
                    const arrayBuffer = await value.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const timestamp = Date.now();
                    const originalName = value.name.replace(/[^a-zA-Z0-9.-]/g, '');
                    const filename = `${key}-${timestamp}-${originalName}`;

                    const uploadDir = path.join(process.cwd(), "public", "uploads");
                    await fs.mkdir(uploadDir, { recursive: true });

                    const filepath = path.join(uploadDir, filename);
                    await fs.writeFile(filepath, buffer);

                    updates[key] = `/uploads/${filename}`;
                } else {
                    throw new Error("Cloud Storage (Vercel Blob) belum terkonfigurasi. Silakan hubungkan di Dashboard Vercel.");
                }
            } else if (typeof value === 'string') {
                updates[key] = value;
            }
        }

        const keys = Object.keys(updates);
        console.log(`Commiting ${keys.length} keys to database...`);

        // Use transaction for consistency and performance
        await prisma.$transaction(
            keys.map(key => prisma.setting.upsert({
                where: { key },
                update: { value: updates[key] },
                create: { key, value: updates[key] }
            }))
        );

        console.log("Database update complete. Revalidating...");
        revalidatePath("/");
        revalidatePath("/mobil");
        revalidatePath("/promo");
        revalidatePath("/tentang");
        revalidatePath("/testimoni");
        revalidatePath("/admin/settings");

        return { success: true };
    } catch (error: any) {
        console.error("Critical error in updateSettingsAction:", error);
        return {
            success: false,
            error: error.message || "Gagal menyimpan ke database. Hubungi developer."
        };
    }
}
