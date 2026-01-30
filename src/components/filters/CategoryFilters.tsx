'use client';

import { useState, useTransition } from 'react';

// Categories from the Animal model enum + "Tout"
const CATEGORIES = [
    { id: 'tout', label: 'Tout', emoji: '🌍' },
    { id: 'Mammifère', label: 'Mammifères', emoji: '🦁' },
    { id: 'Oiseau', label: 'Oiseaux', emoji: '🦅' },
    { id: 'Reptile', label: 'Reptiles', emoji: '🦎' },
    { id: 'Amphibien', label: 'Amphibiens', emoji: '🐸' },
    { id: 'Poisson', label: 'Poissons', emoji: '🐠' },
    { id: 'Invertébré', label: 'Invertébrés', emoji: '🦋' },
];

interface CategoryFiltersProps {
    onFilterChange: (category: string | undefined) => Promise<void>;
    initialCategory?: string;
}

export default function CategoryFilters({ onFilterChange, initialCategory }: CategoryFiltersProps) {
    const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'tout');
    const [isPending, startTransition] = useTransition();

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId);
        startTransition(async () => {
            // Pass undefined for "tout" to fetch all animals
            await onFilterChange(categoryId === 'tout' ? undefined : categoryId);
        });
    };

    return (
        <div className="relative">
            {/* Loading overlay */}
            {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                </div>
            )}

            {/* Filter buttons - Horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            disabled={isPending}
                            className={`
                                flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium
                                transition-all duration-300 ease-out
                                ${isActive
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                                    : 'bg-white text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-emerald-400'
                                }
                                border ${isActive ? 'border-transparent' : 'border-zinc-200 dark:border-zinc-700'}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            <span className="text-base">{category.emoji}</span>
                            <span>{category.label}</span>
                            {isActive && (
                                <span className="ml-1 flex h-2 w-2">
                                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-white/60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
