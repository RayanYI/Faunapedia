'use client';

import { useState } from 'react';
import { IPost } from '@/types';
import { PostGrid } from '@/components/posts';

interface ProfileTabsProps {
    userPosts: IPost[];
    likedPosts: IPost[];
    username: string;
}

type TabType = 'posts' | 'likes';

export default function ProfileTabs({ userPosts, likedPosts, username }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    const tabs = [
        {
            id: 'posts' as const,
            label: 'Publications',
            count: userPosts.length,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            id: 'likes' as const,
            label: "J'aime",
            count: likedPosts.length,
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            ),
        },
    ];

    const currentPosts = activeTab === 'posts' ? userPosts : likedPosts;

    return (
        <div>
            {/* Tab Buttons */}
            <div className="mb-8 flex justify-center">
                <div className="inline-flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-white text-emerald-600 shadow-md dark:bg-zinc-700 dark:text-emerald-400'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                                }
                            `}
                        >
                            <span className={activeTab === tab.id ? 'text-emerald-500' : ''}>
                                {tab.icon}
                            </span>
                            <span>{tab.label}</span>
                            <span className={`
                                rounded-full px-2 py-0.5 text-xs
                                ${activeTab === tab.id
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                    : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
                                }
                            `}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {currentPosts.length > 0 ? (
                    <PostGrid posts={currentPosts} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className={`
                            mb-4 rounded-full p-4
                            ${activeTab === 'posts'
                                ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30'
                                : 'bg-red-100 text-red-500 dark:bg-red-900/30'
                            }
                        `}>
                            {activeTab === 'posts' ? (
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            ) : (
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            )}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                            {activeTab === 'posts'
                                ? 'Aucune publication'
                                : "Aucun j'aime"
                            }
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            {activeTab === 'posts'
                                ? `${username} n'a pas encore partagé de photos.`
                                : `${username} n'a pas encore aimé de publications.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
