'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
    onUploadComplete: (key: string) => void;
    onUploadStart?: () => void;
    onUploadError?: (error: string) => void;
}

export default function ImageUploadEnhanced({
    onUploadComplete,
    onUploadStart,
    onUploadError
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedKey, setUploadedKey] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = useCallback(async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            onUploadError?.('Veuillez sélectionner une image');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            onUploadError?.('L\'image ne doit pas dépasser 10MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        onUploadStart?.();

        try {
            // 1. Request signed URL
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentType: file.type,
                    fileName: file.name,
                }),
            });

            if (!response.ok) {
                throw new Error('Échec de la récupération de l\'URL signée');
            }

            const { url, key } = await response.json();

            // 2. Upload to S3 directly
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error('Échec de l\'upload');
            }

            // 3. Notify parent
            setUploadedKey(key);
            onUploadComplete(key);
        } catch (error) {
            console.error(error);
            onUploadError?.(error instanceof Error ? error.message : 'Échec de l\'upload');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    }, [onUploadComplete, onUploadStart, onUploadError]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const clearImage = () => {
        setPreview(null);
        setUploadedKey(null);
    };

    return (
        <div className="w-full">
            {!preview ? (
                <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        flex flex-col items-center justify-center w-full h-64 
                        border-2 border-dashed rounded-2xl cursor-pointer
                        transition-all duration-300
                        ${dragActive
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800'
                        }
                        ${uploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className={`
                            mb-4 rounded-full p-4 
                            ${dragActive
                                ? 'bg-emerald-100 dark:bg-emerald-800'
                                : 'bg-zinc-100 dark:bg-zinc-700'
                            }
                        `}>
                            <svg className={`w-8 h-8 ${dragActive ? 'text-emerald-600' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-semibold text-emerald-600">Cliquez pour uploader</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                            PNG, JPG, GIF, WEBP (max. 10MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain"
                    />

                    {/* Upload status overlay */}
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                                <span className="text-white font-medium">Upload en cours...</span>
                            </div>
                        </div>
                    )}

                    {/* Success indicator */}
                    {uploadedKey && !uploading && (
                        <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 text-white text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Uploadé
                        </div>
                    )}

                    {/* Clear button */}
                    {!uploading && (
                        <button
                            onClick={clearImage}
                            className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-red-500 hover:bg-red-600 px-3 py-1.5 text-white text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Supprimer
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
