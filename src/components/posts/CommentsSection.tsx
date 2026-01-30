'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { IComment, IUser } from '@/types';
import { getCommentsByPostId, addComment } from '@/actions/social';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CommentsSectionProps {
    postId: string;
    onClose?: () => void;
}

export default function CommentsSection({ postId, onClose }: CommentsSectionProps) {
    const { user: clerkUser, isSignedIn } = useUser();
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Fetch comments on mount
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const data = await getCommentsByPostId(postId);
                setComments(data);
            } catch (err) {
                console.error('Error fetching comments:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    // Scroll to bottom when new comments are added
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isSignedIn || !clerkUser?.id) return;

        setIsSubmitting(true);
        setError(null);

        // Optimistic update
        const optimisticComment: IComment = {
            _id: `temp-${Date.now()}`,
            content: newComment.trim(),
            user: {
                _id: 'temp',
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                username: clerkUser.username || clerkUser.firstName || 'Moi',
                photo: clerkUser.imageUrl,
                following: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            post: postId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setComments(prev => [...prev, optimisticComment]);
        setNewComment('');

        try {
            const result = await addComment(postId, newComment.trim(), clerkUser.id);

            if (!result.success) {
                // Revert on error
                setComments(prev => prev.filter(c => c._id !== optimisticComment._id));
                setError(result.error || 'Erreur lors de l\'ajout du commentaire');
            } else {
                // Refresh comments to get server data
                const updatedComments = await getCommentsByPostId(postId);
                setComments(updatedComments);
            }
        } catch (err) {
            setComments(prev => prev.filter(c => c._id !== optimisticComment._id));
            setError('Erreur lors de l\'ajout du commentaire');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Commentaires ({comments.length})
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 dark:hover:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-6">
                        Aucun commentaire pour le moment. Soyez le premier !
                    </p>
                ) : (
                    comments.map((comment) => {
                        const commentUser = comment.user as IUser | null;
                        const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: fr,
                        });

                        return (
                            <div
                                key={comment._id}
                                className={`
                                    flex gap-3 animate-fade-in-up
                                    ${comment._id.startsWith('temp-') ? 'opacity-70' : ''}
                                `}
                            >
                                {/* Avatar - Clickable */}
                                {commentUser?.username ? (
                                    <Link
                                        href={`/profil/${commentUser.username}`}
                                        className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full transition-all hover:ring-2 hover:ring-emerald-500"
                                    >
                                        {commentUser.photo ? (
                                            <Image
                                                src={commentUser.photo}
                                                alt={commentUser.username}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-semibold">
                                                {commentUser.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </Link>
                                ) : (
                                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-semibold">
                                            ?
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        {commentUser?.username ? (
                                            <Link
                                                href={`/profil/${commentUser.username}`}
                                                className="font-semibold text-sm text-zinc-900 hover:text-emerald-600 transition-colors dark:text-white dark:hover:text-emerald-400"
                                            >
                                                {commentUser.username}
                                            </Link>
                                        ) : (
                                            <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                                                Anonyme
                                            </span>
                                        )}
                                        <span className="text-xs text-zinc-400">
                                            {timeAgo}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-zinc-100 dark:border-zinc-800">
                {isSignedIn ? (
                    <>
                        {/* User Avatar */}
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                            {clerkUser?.imageUrl ? (
                                <Image
                                    src={clerkUser.imageUrl}
                                    alt="You"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-semibold">
                                    {clerkUser?.firstName?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ajouter un commentaire..."
                            maxLength={500}
                            disabled={isSubmitting}
                            className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className={`
                                flex h-9 w-9 items-center justify-center rounded-full transition-all
                                ${newComment.trim() && !isSubmitting
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-700'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </>
                ) : (
                    <p className="flex-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        <a href="/sign-in" className="text-emerald-500 hover:underline">
                            Connectez-vous
                        </a>
                        {' '}pour commenter
                    </p>
                )}
            </form>
        </div>
    );
}
