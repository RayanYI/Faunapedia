'use client';

import Image from 'next/image';
import { IPost, IUser } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PostCardProps {
    post: IPost;
}

export default function PostCard({ post }: PostCardProps) {
    const user = post.user as IUser | null;

    // Format the date
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: fr,
    });

    return (
        <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-zinc-900">
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Photo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {/* Caption */}
                    {post.caption && (
                        <p className="p-4 text-sm text-white line-clamp-3">
                            {post.caption}
                        </p>
                    )}
                </div>

                {/* Like Button (decorative) */}
                <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-600 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-red-500 group-hover:opacity-100 dark:bg-zinc-800/90 dark:text-zinc-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-4">
                {/* Avatar */}
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
                    {user?.photo ? (
                        <Image
                            src={user.photo}
                            alt={user.username || 'User'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                            <span className="text-sm font-semibold">
                                {user?.username?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-zinc-900 dark:text-white">
                        {user?.username || 'Utilisateur anonyme'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {timeAgo}
                    </p>
                </div>
            </div>
        </article>
    );
}
