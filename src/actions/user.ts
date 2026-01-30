'use server';

import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import Post from "@/models/Post";
import { IPost, IUser } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Fetches public user profile by username.
 */
export async function getUserByUsername(username: string): Promise<IUser | null> {
    try {
        await connectToDatabase();
        const user = await User.findOne({ username }).lean();

        if (!user) return null;

        return {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        } as IUser;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

/**
 * Fetches public user profile by ID.
 */
export async function getUserById(userId: string): Promise<IUser | null> {
    try {
        await connectToDatabase();
        const user = await User.findById(userId).lean();

        if (!user) return null;

        return {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        } as IUser;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

/**
 * Fetches posts created by a specific user.
 */
export async function getUserPosts(userId: string): Promise<IPost[]> {
    try {
        await connectToDatabase();

        // Needed for isLiked check
        const clerkUser = await currentUser();
        let currentUserIdStr: string | null = null;
        if (clerkUser) {
            const dbUser = await User.findOne({ clerkId: clerkUser.id });
            if (dbUser) currentUserIdStr = dbUser._id.toString();
        }

        const posts = await Post.find({ user: userId })
            .populate('user', 'username photo')
            .populate('animal', 'name category') // Populate basic animal info
            .sort({ createdAt: -1 })
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return posts.map((post: any) => {
            const likes = (post.likes || []).map((id: any) => id.toString());

            return {
                ...post,
                _id: post._id.toString(),
                user: post.user ? {
                    ...post.user,
                    _id: post.user._id.toString(),
                } : null,
                animal: post.animal ? {
                    ...post.animal,
                    _id: post.animal._id.toString(),
                } : null, // Used to link back to animal page
                likes: likes,
                isLiked: currentUserIdStr ? likes.includes(currentUserIdStr) : false,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            };
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
}

/**
 * Fetches posts liked by a specific user.
 */
export async function getUserLikedPosts(userId: string): Promise<IPost[]> {
    try {
        await connectToDatabase();

        // Needed for isLiked check (which is strictly true here, but good for consistency)
        const clerkUser = await currentUser();
        let currentUserIdStr: string | null = null;
        if (clerkUser) {
            const dbUser = await User.findOne({ clerkId: clerkUser.id });
            if (dbUser) currentUserIdStr = dbUser._id.toString();
        }

        const posts = await Post.find({ likes: userId })
            .populate('user', 'username photo')
            .populate('animal', 'name category')
            .sort({ createdAt: -1 })
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return posts.map((post: any) => {
            const likes = (post.likes || []).map((id: any) => id.toString());

            return {
                ...post,
                _id: post._id.toString(),
                user: post.user ? {
                    ...post.user,
                    _id: post.user._id.toString(),
                } : null,
                animal: post.animal ? {
                    ...post.animal,
                    _id: post.animal._id.toString(),
                } : null,
                likes: likes,
                isLiked: currentUserIdStr ? likes.includes(currentUserIdStr) : false,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            };
        });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return [];
    }
}
