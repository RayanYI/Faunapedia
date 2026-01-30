import Link from 'next/link';

export default function ProfileNotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950">
            <div className="text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                {/* Text */}
                <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
                    Utilisateur introuvable
                </h1>
                <p className="mb-8 text-zinc-500 dark:text-zinc-400">
                    Ce profil n'existe pas ou a été supprimé.
                </p>

                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour à l'accueil
                </Link>
            </div>
        </main>
    );
}
