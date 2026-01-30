'use client';

import { useState, useCallback } from 'react';
import { IAnimal } from '@/types';
import { getAnimals } from '@/actions/animals';
import { AnimalGrid } from '@/components/animals';
import { CategoryFilters } from '@/components/filters';

interface AnimalsSectionProps {
    initialAnimals: IAnimal[];
}

export default function AnimalsSection({ initialAnimals }: AnimalsSectionProps) {
    const [animals, setAnimals] = useState<IAnimal[]>(initialAnimals);
    const [currentCategory, setCurrentCategory] = useState<string | undefined>(undefined);

    const handleFilterChange = useCallback(async (category: string | undefined) => {
        setCurrentCategory(category);
        const filteredAnimals = await getAnimals(category);
        setAnimals(filteredAnimals);
    }, []);

    // Dynamic title based on category
    const getSectionTitle = () => {
        if (!currentCategory) return 'Tous les animaux';

        const titles: Record<string, string> = {
            'Mammifère': 'Mammifères',
            'Oiseau': 'Oiseaux',
            'Reptile': 'Reptiles',
            'Amphibien': 'Amphibiens',
            'Poisson': 'Poissons',
            'Invertébré': 'Invertébrés',
        };

        return titles[currentCategory] || currentCategory;
    };

    return (
        <main className="container mx-auto px-4 pb-24 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                        {getSectionTitle()}
                    </h2>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        {animals.length} espèce{animals.length > 1 ? 's' : ''} trouvée{animals.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Category Filters */}
                <CategoryFilters
                    onFilterChange={handleFilterChange}
                    initialCategory={currentCategory}
                />
            </div>

            {/* Animals Grid */}
            <AnimalGrid animals={animals} />
        </main>
    );
}
