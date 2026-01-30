import { IPost } from '@/types';
import PostCard from './PostCard';

interface PostGridProps {
    posts: IPost[];
    emptyMessage?: string;
}

export default function PostGrid({ posts, emptyMessage = "Aucune photo pour le moment" }: PostGridProps) {
    if (posts.length === 0) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-12 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 p-6 dark:from-emerald-900/30 dark:to-teal-900/30">
                    <svg className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-700 dark:text-zinc-200">
                    {emptyMessage}
                </h3>
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                    Soyez le premier à partager une photo de cet animal !
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
                <div
                    key={post._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <PostCard post={post} />
                </div>
            ))}
        </div>
    );
}
