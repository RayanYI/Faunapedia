'use server';

import { connectToDatabase } from "@/lib/mongoose";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { IComment } from "@/types";

/**
 * Toggles a like on a post for a specific user.
 */
export async function toggleLike(postId: string, clerkUserId: string): Promise<{ success: boolean; liked?: boolean; error?: string }> {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) return { success: false, error: "User not found" };

        const post = await Post.findById(postId);
        if (!post) return { success: false, error: "Post not found" };

        const userIdStr = user._id.toString();
        const likes = post.likes || []; // Protection défensive
        const isLiked = likes.some((id: any) => id.toString() === userIdStr);

        if (isLiked) {
            // Unlike
            post.likes = likes.filter((id: any) => id.toString() !== userIdStr);
        } else {
            // Like
            if (!post.likes) post.likes = [];
            post.likes.push(user._id);
        }

        await post.save();
        revalidatePath(`/animals/${post.animal}`); // Revalidate animal page

        return { success: true, liked: !isLiked };
    } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, error: "Failed to toggle like" };
    }
}

/**
 * Adds a new comment to a post.
 */
export async function addComment(postId: string, content: string, clerkUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) return { success: false, error: "User not found" };

        await Comment.create({
            content,
            post: postId,
            user: user._id,
        });

        const post = await Post.findById(postId);
        revalidatePath(`/animals/${post.animal}`); // Revalidate to show new comment count or interactions

        return { success: true };
    } catch (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: "Failed to add comment" };
    }
}

/**
 * Fetches comments for a specific post.
 */
export async function getCommentsByPostId(postId: string): Promise<IComment[]> {
    try {
        await connectToDatabase();

        const comments = await Comment.find({ post: postId })
            .populate('user', 'username photo')
            .sort({ createdAt: 1 }) // Chronological order
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return comments.map((comment: any) => ({
            _id: comment._id.toString(),
            content: comment.content,
            user: comment.user ? {
                ...comment.user,
                _id: comment.user._id.toString(),
            } : null,
            post: comment.post.toString(),
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}
