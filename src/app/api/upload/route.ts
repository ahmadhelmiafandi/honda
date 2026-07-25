
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
        }

        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

        // Attempt 1: Vercel Blob Storage (if configured)
        if (blobToken) {
            try {
                const blob = await put(file.name, file, {
                    access: 'public',
                    addRandomSuffix: true,
                    token: blobToken,
                });
                return NextResponse.json({ url: blob.url });
            } catch (blobError: any) {
                console.warn("[Upload API] Vercel Blob failed, switching to Base64 data URL fallback:", blobError.message);
            }
        }

        // Attempt 2: Base64 Data URL Fallback (Works 100% reliably in Serverless Vercel & Local)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = file.type || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

        // Optionally write to local disk in development
        try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadsDir, { recursive: true });
            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const ext = path.extname(cleanName) || '.jpg';
            const basename = path.basename(cleanName, ext);
            const filename = `${basename}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
            await writeFile(path.join(uploadsDir, filename), buffer);
        } catch (e) {
            // Ignore filesystem errors in serverless
        }

        return NextResponse.json({ url: dataUrl });
    } catch (error: any) {
        console.error("[Upload API] System error:", error);
        return NextResponse.json({ error: `Kesalahan Sistem: ${error.message}` }, { status: 500 });
    }
}


