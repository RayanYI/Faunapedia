import { getAnimalHabitats, getMapPosts } from '@/actions/map';
import { WorldMap } from '@/components/map';

export const metadata = {
    title: 'Carte Mondiale | Faunapedia',
    description: 'Explorez les habitats des animaux et les photos géolocalisées sur la carte interactive.',
};

export default async function MapPage() {
    // Fetch map data in parallel
    const [habitatPoints, postPoints] = await Promise.all([
        getAnimalHabitats(),
        getMapPosts(),
    ]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950">
            {/* Header */}
            <section className="relative overflow-hidden py-16">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        <span className="text-lg">🗺️</span>
                        Carte Interactive
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
                        Explorez le Monde
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Découvrez où vivent les animaux dans leur habitat naturel et explorez les photos partagées par la communauté à travers le monde.
                    </p>

                    {/* Stats */}
                    <div className="mt-8 flex justify-center gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {habitatPoints.length}
                            </div>
                            <div className="text-sm text-zinc-500">Habitats</div>
                        </div>
                        <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-700" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {postPoints.length}
                            </div>
                            <div className="text-sm text-zinc-500">Photos</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="mx-auto max-w-7xl px-4 pb-16">
                <WorldMap
                    habitatPoints={habitatPoints}
                    postPoints={postPoints}
                />

                {/* Legend */}
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                            🦁
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            Habitats naturels
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                            📷
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            Photos de la communauté
                        </span>
                    </div>
                </div>
            </section>
        </main>
    );
}
