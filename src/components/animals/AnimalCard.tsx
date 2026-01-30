'use client';

import Image from 'next/image';
import { IAnimal } from '@/types';

interface AnimalCardProps {
    animal: IAnimal;
}

export default function AnimalCard({ animal }: AnimalCardProps) {
    return (
        <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 dark:bg-zinc-900">
            {/* Image Container */}
            <div className="relative h-56 w-full overflow-hidden">
                {animal.imageUrl ? (
                    <Image
                        src={animal.imageUrl}
                        alt={animal.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
                        <span className="text-6xl">🦁</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Badge */}
                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-emerald-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        Animal
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="mb-1 text-xl font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {animal.name}
                </h3>

                {animal.scientificName && (
                    <p className="mb-3 text-sm italic text-zinc-500 dark:text-zinc-400">
                        {animal.scientificName}
                    </p>
                )}

                {animal.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {animal.description}
                    </p>
                )}

                {/* Action Button */}
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg group-hover:opacity-100">
                    <span>Découvrir</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>

            {/* Decorative Corner */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
        </article>
    );
}
