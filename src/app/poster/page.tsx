'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { IAnimal } from '@/types';
import { getAnimals } from '@/actions/animals';
import { createPost } from '@/actions/posts';
import { ImageUploadEnhanced } from '@/components/upload';

export default function PosterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoaded } = useUser();

    // Get animalId from URL if present
    const preselectedAnimalId = searchParams.get('animalId');

    // Form state
    const [s3Key, setS3Key] = useState<string | null>(null);
    const [selectedAnimalId, setSelectedAnimalId] = useState<string>(preselectedAnimalId || '');
    const [caption, setCaption] = useState('');

    // UI state
    const [animals, setAnimals] = useState<IAnimal[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Fetch animals on mount
    useEffect(() => {
        const fetchAnimals = async () => {
            const data = await getAnimals();
            setAnimals(data);

            // If preselectedAnimalId exists and is valid, keep it selected
            if (preselectedAnimalId && data.some(a => a._id === preselectedAnimalId)) {
                setSelectedAnimalId(preselectedAnimalId);
            }
        };
        fetchAnimals();
    }, [preselectedAnimalId]);

    // Find the selected animal for display
    const selectedAnimal = animals.find(a => a._id === selectedAnimalId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!s3Key) {
            setError('Veuillez uploader une image');
            return;
        }
        if (!selectedAnimalId) {
            setError('Veuillez sélectionner un animal');
            return;
        }
        if (!user?.id) {
            setError('Vous devez être connecté');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createPost(s3Key, selectedAnimalId, caption, user.id);

            if (result.success) {
                setSuccess(true);
                // Redirect after a short delay
                setTimeout(() => {
                    router.push(`/animals/${selectedAnimalId}`);
                }, 1500);
            } else {
                setError(result.error || 'Erreur lors de la publication');
            }
        } catch (err) {
            console.error(err);
            setError('Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state while Clerk loads
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {/* Page Title */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
                            Publier une photo
                        </h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                            {selectedAnimal
                                ? `Partagez votre photo de ${selectedAnimal.name}`
                                : 'Partagez votre rencontre avec la faune sauvage'
                            }
                        </p>
                    </div>

                    {/* Preselected Animal Notice */}
                    {preselectedAnimalId && selectedAnimal && (
                        <div className="mb-6 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-900/30">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                                        Animal pré-sélectionné
                                    </p>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                        {selectedAnimal.name} {selectedAnimal.scientificName && `(${selectedAnimal.scientificName})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-900/30">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
                                    <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                                        Publication réussie !
                                    </p>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                        Redirection en cours...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 rounded-2xl bg-red-50 p-4 dark:bg-red-900/30">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
                                    <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
                            <label className="mb-3 block text-sm font-semibold text-zinc-900 dark:text-white">
                                Photo *
                            </label>
                            <ImageUploadEnhanced
                                onUploadComplete={(key) => setS3Key(key)}
                                onUploadError={(err) => setError(err)}
                            />
                        </div>

                        {/* Animal Select */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
                            <label className="mb-3 block text-sm font-semibold text-zinc-900 dark:text-white">
                                Animal *
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedAnimalId}
                                    onChange={(e) => setSelectedAnimalId(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                    disabled={isSubmitting}
                                >
                                    <option value="">Sélectionnez un animal...</option>
                                    {animals.map((animal) => (
                                        <option key={animal._id} value={animal._id}>
                                            {animal.name} {animal.scientificName ? `(${animal.scientificName})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {animals.length === 0 && (
                                <p className="mt-2 text-sm text-zinc-500">Chargement des animaux...</p>
                            )}
                        </div>

                        {/* Caption */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
                            <label className="mb-3 block text-sm font-semibold text-zinc-900 dark:text-white">
                                Légende
                            </label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Décrivez votre photo..."
                                rows={4}
                                maxLength={500}
                                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600"
                                disabled={isSubmitting}
                            />
                            <p className="mt-2 text-right text-xs text-zinc-500">
                                {caption.length}/500 caractères
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || success || !s3Key || !selectedAnimalId}
                            className={`
                                w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold
                                transition-all duration-300
                                ${isSubmitting || success || !s3Key || !selectedAnimalId
                                    ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/25'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Publication en cours...
                                </>
                            ) : success ? (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Publié !
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Publier
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href={preselectedAnimalId ? `/animals/${preselectedAnimalId}` : '/'}
                            className="text-sm text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                        >
                            ← Retour {preselectedAnimalId && selectedAnimal ? `à ${selectedAnimal.name}` : "à l'accueil"}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
