import { IAnimal } from '@/types';
import AnimalCard from './AnimalCard';

interface AnimalGridProps {
    animals: IAnimal[];
}

export default function AnimalGrid({ animals }: AnimalGridProps) {
    if (animals.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-12 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 p-6 dark:from-emerald-900/30 dark:to-teal-900/30">
                    <span className="text-5xl">🦊</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-700 dark:text-zinc-200">
                    Aucun animal trouvé
                </h3>
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                    Il n&apos;y a pas encore d&apos;animaux dans la base de données.
                    <br />
                    Revenez bientôt pour découvrir notre faune !
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {animals.map((animal, index) => (
                <div
                    key={animal._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <AnimalCard animal={animal} />
                </div>
            ))}
        </div>
    );
}
