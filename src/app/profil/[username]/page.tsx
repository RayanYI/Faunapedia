import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getUserByUsername, getUserPosts, getUserLikedPosts } from '@/actions/user';
import ProfileTabs from './ProfileTabs';

// Badge info mapping
function getBadgeInfo(code: string): { emoji: string; label: string } {
    const badges: Record<string, { emoji: string; label: string }> = {
        FIRST_POST: { emoji: '🥇', label: 'Explorateur Débutant' },
        PHOTOGRAPHER: { emoji: '📸', label: 'Photographe Passionné' },
        EXPERT: { emoji: '🏆', label: 'Expert Faune' },
        QUIZ_MASTER: { emoji: '🧠', label: 'Maître du Quiz' },
    };
    return badges[code] || { emoji: '🎖️', label: code };
}

interface ProfilePageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
    const { username } = await params;
    // Décoder le username pour gérer les espaces et caractères spéciaux
    const decodedUsername = decodeURIComponent(username);
    const user = await getUserByUsername(decodedUsername);

    if (!user) {
        return { title: 'Utilisateur non trouvé | Faunapedia' };
    }

    return {
        title: `${user.username} | Faunapedia`,
        description: `Découvrez le profil de ${user.username} sur Faunapedia`,
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;
    // Décoder le username pour gérer les espaces et caractères spéciaux
    const decodedUsername = decodeURIComponent(username);
    const user = await getUserByUsername(decodedUsername);

    if (!user) {
        notFound();
    }

    // Fetch posts data in parallel
    const [userPosts, likedPosts] = await Promise.all([
        getUserPosts(user._id),
        getUserLikedPosts(user._id),
    ]);

    // Calculate stats
    const postCount = userPosts.length;
    const likeCount = likedPosts.length;

    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />

                <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full ring-4 ring-white shadow-2xl dark:ring-zinc-800">
                                {user.photo ? (
                                    <Image
                                        src={user.photo}
                                        alt={user.username || 'User'}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                                        <span className="text-5xl font-bold">
                                            {user.username?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Online indicator (decorative) */}
                            <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-800" />
                        </div>

                        {/* Username */}
                        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
                            {user.username}
                        </h1>

                        {/* Email (optional - could hide for privacy) */}
                        <p className="mb-6 text-zinc-500 dark:text-zinc-400">
                            Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {postCount}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Publications
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-500 dark:text-red-400">
                                    {likeCount}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    J&apos;aime
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-amber-500 dark:text-amber-400">
                                    ⭐ {user.points || 0}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Points
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        {user.badges && user.badges.length > 0 && (
                            <div className="mt-8">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                    Badges
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {user.badges.map((badge: { code: string; earnedAt: string }, index: number) => {
                                        const badgeInfo = getBadgeInfo(badge.code);
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 shadow-sm dark:from-amber-900/30 dark:to-yellow-900/30"
                                                title={`Obtenu le ${new Date(badge.earnedAt).toLocaleDateString('fr-FR')}`}
                                            >
                                                <span className="text-lg">{badgeInfo.emoji}</span>
                                                <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                                    {badgeInfo.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <ProfileTabs
                    userPosts={userPosts}
                    likedPosts={likedPosts}
                    username={user.username || 'Utilisateur'}
                />
            </section>
        </main>
    );
}
