'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export default function Header() {
    const pathname = usePathname();

    // Don't show header on auth pages
    if (pathname?.startsWith('/sign-')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-900/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                            <span className="text-xl">🐾</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Faunapedia
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {/* Home Link */}
                        <Link
                            href="/"
                            className={`
                                hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                                ${pathname === '/'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }
                            `}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Accueil</span>
                        </Link>

                        {/* Map Link */}
                        <Link
                            href="/map"
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                                ${pathname === '/map'
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }
                            `}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="hidden sm:inline">Carte</span>
                        </Link>

                        {/* Post Button - Always visible for signed in users */}
                        <SignedIn>
                            <Link
                                href="/poster"
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                    ${pathname === '/poster'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/25'
                                    }
                                `}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">Poster</span>
                            </Link>

                            {/* User Menu */}
                            <div className="ml-2">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: 'h-9 w-9 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900',
                                        }
                                    }}
                                />
                            </div>
                        </SignedIn>

                        {/* Sign In Button for signed out users */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Connexion</span>
                                </button>
                            </SignInButton>

                            <Link
                                href="/poster"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">Poster</span>
                            </Link>
                        </SignedOut>
                    </nav>
                </div>
            </div>
        </header>
    );
}
