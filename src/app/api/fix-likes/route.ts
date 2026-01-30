import { connectToDatabase } from "@/lib/mongoose";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        // Update all posts that do not have the 'likes' field
        const result = await Post.updateMany(
            { likes: { $exists: false } },
            { $set: { likes: [] } }
        );

        return NextResponse.json({
            message: "Migration completed successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json({ error: "Failed to migrate database" }, { status: 500 });
    }
}
