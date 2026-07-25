
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

        // Attempt 1: Vercel Blob Storage (if token is available)
        if (blobToken) {
            try {
                const blob = await put(file.name, file, {
                    access: 'public',
                    addRandomSuffix: true,
                    token: blobToken,
                });
                return NextResponse.json({ url: blob.url });
            } catch (blobError: any) {
                console.warn("[Upload API] Vercel Blob upload failed, switching to local storage fallback:", blobError.message);
            }
        }

        // Attempt 2: Local Disk Storage Fallback (public/uploads)
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadsDir, { recursive: true });

            // Generate clean unique filename
            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const ext = path.extname(cleanName) || '.jpg';
            const basename = path.basename(cleanName, ext);
            const filename = `${basename}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
            const filePath = path.join(uploadsDir, filename);

            await writeFile(filePath, buffer);

            const fileUrl = `/uploads/${filename}`;
            return NextResponse.json({ url: fileUrl });
        } catch (localError: any) {
            console.error("[Upload API] Local upload error:", localError);
            return NextResponse.json({ error: `Gagal menyimpan gambar: ${localError.message}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error("[Upload API] System error:", error);
        return NextResponse.json({ error: `Kesalahan Sistem: ${error.message}` }, { status: 500 });
    }
}

