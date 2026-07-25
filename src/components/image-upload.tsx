
"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
    name: string;
    defaultValue?: string;
    recommendation?: string;
}

export function ImageUpload({ name, defaultValue, recommendation }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await res.json();
            if (data.url) {
                setPreview(data.url);
            }
        } catch (error: any) {
            console.error("Upload failed", error);
            alert(`Upload Gagal: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <input type="hidden" name={name} value={preview || ""} />

            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.label
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                            <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                                {isUploading ? (
                                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                                ) : (
                                    <Upload className="h-6 w-6 text-blue-600" />
                                )}
                            </div>
                            <p className="text-sm font-bold text-slate-700 mb-1">Klik untuk Upload</p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">PNG, JPG atau WEBP (Maks. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                    </motion.label>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
                    >
                        {preview && preview !== "" && (
                            <Image src={preview} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="h-10 w-10 rounded-lg bg-white flex items-center justify-center cursor-pointer hover:bg-blue-600 group/btn transition-all">
                                <Upload className="h-4 w-4 text-slate-900 group-hover/btn:text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                            </label>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-10 w-10 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
                                onClick={() => setPreview(null)}
                            >
                                <X className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                        <AnimatePresence>
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20"
                                >
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {recommendation && (
                <p className="text-[10px] text-slate-400 font-medium px-1">
                    <span className="font-bold text-blue-600">Saran:</span> {recommendation}
                </p>
            )}
        </div>
    );
}
