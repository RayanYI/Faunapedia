'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IAnimal } from '@/types';

interface AnimalHeroProps {
    animal: IAnimal;
    postCount: number;
}

export default function AnimalHero({ animal, postCount }: AnimalHeroProps) {
    return (
        <section className="relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {animal.imageUrl ? (
                    <Image
                        src={animal.imageUrl}
                        alt={animal.name}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-emerald-600 to-teal-700" />
                )}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="container relative mx-auto px-4 py-32 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </Link>

                {/* Animal Info */}
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-300 backdrop-blur-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                            Espèce
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                        {animal.name}
                    </h1>

                    {/* Scientific Name */}
                    {animal.scientificName && (
                        <p className="mb-6 text-xl italic text-emerald-300/90">
                            {animal.scientificName}
                        </p>
                    )}

                    {/* Description */}
                    {animal.description && (
                        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/80">
                            {animal.description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30">
                                <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{postCount}</p>
                                <p className="text-sm text-white/60">Photos</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/30">
                                <span className="text-xl">🌍</span>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-white">Mondial</p>
                                <p className="text-sm text-white/60">Habitat</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button - Add Photo */}
                    <div className="mt-8">
                        <Link
                            href={`/poster?animalId=${animal._id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Ajouter une photo de {animal.name}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -left-20 top-1/2 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
        </section>
    );
}
