'use client';

import { useState } from 'react';

export default function ImageUpload({ onUploadComplete }: { onUploadComplete: (key: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

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
                throw new Error('Failed to get presigned URL');
            }

            const { url, key } = await response.json();

            // 2. Upload to S3 directly
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            // 3. Notify parent
            onUploadComplete(key);
            alert('Upload successful!');
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
        "
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
    );
}
