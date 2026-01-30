import { notFound } from 'next/navigation';
import { getAnimalById } from '@/actions/animals';
import { getPostsByAnimalId } from '@/actions/posts';
import { AnimalHero } from '@/components/animals';
import { PostGrid } from '@/components/posts';

interface AnimalPageProps {
    params: Promise<{ id: string }>;
}

export default async function AnimalPage({ params }: AnimalPageProps) {
    const { id } = await params;

    // Fetch animal and posts in parallel
    const [animal, posts] = await Promise.all([
        getAnimalById(id),
        getPostsByAnimalId(id),
    ]);

    if (!animal) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
            {/* Hero Section */}
            <AnimalHero animal={animal} postCount={posts.length} />

            {/* Posts Section */}
            <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                        Photos de la communauté
                    </h2>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        Découvrez les photos partagées par nos membres
                    </p>
                </div>

                {/* Posts Grid */}
                <PostGrid
                    posts={posts}
                    emptyMessage={`Aucune photo de ${animal.name} pour le moment`}
                />
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-200 bg-white/50 py-8 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        © 2026 Faunapedia. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
}
