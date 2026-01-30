'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { IPost, IUser } from '@/types';
import { toggleLike } from '@/actions/social';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import CommentsSection from './CommentsSection';

interface PostCardProps {
    post: IPost;
}

export default function PostCard({ post }: PostCardProps) {
    const { user: clerkUser, isSignedIn } = useUser();
    const postUser = post.user as IUser | null;
    const [showComments, setShowComments] = useState(false);

    // Protection défensive
    const initialLikes = post.likes || [];
    const initialLikeCount = initialLikes.length;

    // État simple pour le like
    const [isLiked, setIsLiked] = useState(!!post.isLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (!isSignedIn || !clerkUser?.id || isLoading) return;

        // Sauvegarder l'état actuel pour rollback
        const previousIsLiked = isLiked;
        const previousCount = likeCount;

        // Mise à jour optimiste immédiate
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
        setIsLoading(true);

        try {
            const result = await toggleLike(post._id, clerkUser.id);

            if (result.success) {
                // Synchroniser avec le serveur
                setIsLiked(result.liked ?? newIsLiked);
            } else {
                // Rollback en cas d'erreur
                setIsLiked(previousIsLiked);
                setLikeCount(previousCount);
                console.error('Like error:', result.error);
            }
        } catch (error) {
            // Rollback en cas d'exception
            setIsLiked(previousIsLiked);
            setLikeCount(previousCount);
            console.error('Like failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Format the date
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: fr,
    });

    return (
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-zinc-900">
            {/* Image Container */}
            <div className="group relative aspect-square w-full overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Photo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover Overlay with Caption */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {post.caption && (
                        <p className="p-4 text-sm text-white line-clamp-3">
                            {post.caption}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={!isSignedIn || isLoading}
                    className={`
                        flex items-center gap-1.5 transition-all duration-200
                        ${isLiked
                            ? 'text-red-500'
                            : 'text-zinc-500 hover:text-red-500 dark:text-zinc-400'
                        }
                        ${!isSignedIn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${isLoading ? 'scale-95 opacity-70' : 'hover:scale-105'}
                    `}
                    title={isSignedIn ? (isLiked ? 'Retirer le like' : 'Aimer') : 'Connectez-vous pour aimer'}
                >
                    {isLiked ? (
                        // Filled heart
                        <svg className="h-6 w-6 animate-[pulse_0.3s_ease-in-out]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    ) : (
                        // Empty heart
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    )}
                    <span className="text-sm font-medium">{likeCount}</span>
                </button>

                {/* Comment Button */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`
                        flex items-center gap-1.5 transition-all duration-200
                        ${showComments
                            ? 'text-emerald-500'
                            : 'text-zinc-500 hover:text-emerald-500 dark:text-zinc-400'
                        }
                        hover:scale-105
                    `}
                    title="Voir les commentaires"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                    <span className="text-sm font-medium">Commenter</span>
                </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-4">
                {/* Avatar */}
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
                    {postUser?.photo ? (
                        <Image
                            src={postUser.photo}
                            alt={postUser.username || 'User'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                            <span className="text-sm font-semibold">
                                {postUser?.username?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-zinc-900 dark:text-white">
                        {postUser?.username || 'Utilisateur anonyme'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {timeAgo}
                    </p>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <CommentsSection
                    postId={post._id}
                    onClose={() => setShowComments(false)}
                />
            )}
        </article>
    );
}
