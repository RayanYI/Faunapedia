import { getAnimals } from '@/actions/animals';
import { AnimalGrid } from '@/components/animals';

export default async function Home() {
  const animals = await getAnimals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
      {/* Hero Section */}
      <header className="relative overflow-hidden pb-12 pt-24">
        {/* Background Decorations */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 blur-3xl" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-gradient-to-bl from-cyan-400/15 to-emerald-500/15 blur-3xl" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Logo/Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <span className="text-4xl">🐾</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-zinc-200 dark:to-white sm:text-6xl lg:text-7xl">
              Faunapedia
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
              Explorez le monde fascinant de la faune sauvage.
              Découvrez des espèces incroyables du monde entier.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {animals.length}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Espèces
                </span>
              </div>
              <div className="h-12 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                  🌍
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Mondial
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-24 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
              Tous les animaux
            </h2>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              Parcourez notre collection d&apos;espèces
            </p>
          </div>

          {/* Filter placeholder */}
          <div className="hidden items-center gap-2 sm:flex">
            <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400">
              Tous
            </button>
            <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400">
              Mammifères
            </button>
            <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400">
              Oiseaux
            </button>
          </div>
        </div>

        {/* Animals Grid */}
        <AnimalGrid animals={animals} />
      </main>

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
