
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
                let uploadedUrl: string | null = null;

                // Attempt 1: Vercel Blob Storage
                if (blobToken) {
                    try {
                        const blob = await put(`${key}-${value.name}`, value, {
                            access: 'public',
                            addRandomSuffix: true,
                            token: blobToken,
                        });
                        uploadedUrl = blob.url;
                    } catch (blobError: any) {
                        console.warn(`[Settings Action] Vercel Blob upload failed for ${key}, falling back to local storage:`, blobError.message);
                    }
                }

                // Attempt 2: Base64 Data URL Fallback (Guaranteed to work on Vercel & Local)
                if (!uploadedUrl) {
                    try {
                        const arrayBuffer = await value.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const mimeType = value.type || 'image/jpeg';
                        uploadedUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

                        // Optionally save to local disk in development
                        try {
                            const timestamp = Date.now();
                            const originalName = value.name.replace(/[^a-zA-Z0-9.-]/g, '');
                            const filename = `${key}-${timestamp}-${originalName}`;
                            const uploadDir = path.join(process.cwd(), "public", "uploads");
                            await fs.mkdir(uploadDir, { recursive: true });
                            await fs.writeFile(path.join(uploadDir, filename), buffer);
                        } catch (e) {
                            // Ignore disk write errors on serverless
                        }
                    } catch (localError: any) {
                        console.error(`[Settings Action] Base64 processing failed for ${key}:`, localError);
                        throw new Error(`Gagal menyimpan file ${key}: ${localError.message}`);
                    }
                }

                updates[key] = uploadedUrl;
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
