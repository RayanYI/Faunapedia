'use server';

import { connectToDatabase } from "@/lib/mongoose";
import Post from "@/models/Post";
import User from "@/models/User"; // Ensure User model is registered
import Animal from "@/models/Animal"; // Ensure Animal model is registered
import { IPost } from "@/types";

/**
 * Fetches posts associated with a specific animal.
 */
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Fetches posts associated with a specific animal.
 */
export async function getPostsByAnimalId(animalId: string): Promise<IPost[]> {
    try {
        await connectToDatabase();

        // Ensure models are registered to avoid Schema hasn't been registered for model "User"/ "Animal"
        // This can happen in dev mode hot reload sometimes if not explicitly imported/registered
        console.log("Models loaded:", !!User, !!Animal);

        // Get current user to check for likes
        const clerkUser = await currentUser();
        let currentUserIdStr: string | null = null;

        if (clerkUser) {
            const dbUser = await User.findOne({ clerkId: clerkUser.id });
            if (dbUser) {
                currentUserIdStr = dbUser._id.toString();
            }
        }

        const posts = await Post.find({ animal: animalId })
            .populate('user', 'username photo clerkId') // Populate user details
            .sort({ createdAt: -1 })
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return posts.map((post: any) => {
            // Convert likes to strings
            const likes = (post.likes || []).map((id: any) => id.toString());

            return {
                ...post,
                _id: post._id.toString(),
                user: post.user ? {
                    ...post.user,
                    _id: post.user._id.toString(),
                } : null,
                animal: post.animal ? post.animal.toString() : null,
                likes: likes,
                isLiked: currentUserIdStr ? likes.includes(currentUserIdStr) : false,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            };
        });
    } catch (error) {
        console.error("Error fetching posts by animal ID:", error);
        return [];
    }
}

/**
 * Creates a new post.
 */
export async function createPost(
    s3Key: string,
    animalId: string,
    caption: string,
    clerkUserId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDatabase();

        // Find internal User ID from Clerk ID
        const user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            return { success: false, error: "User not found in database. Please log in again." };
        }

        // Construct full S3 URL
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        await Post.create({
            imageUrl,
            user: user._id,
            animal: animalId,
            caption,
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating post:", error);
        return { success: false, error: "Failed to create post" };
    }
}
