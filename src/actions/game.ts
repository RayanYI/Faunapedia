'use server';

import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import QuizQuestion from "@/models/QuizQuestion";
import Post from "@/models/Post";
import { IQuizQuestion } from "@/types";
import { revalidatePath } from "next/cache";

// Badge Definitions
const BADGES = {
    FIRST_POST: { code: 'FIRST_POST', label: 'Explorateur Débutant', threshold: 1 },
    PHOTOGRAPHER: { code: 'PHOTOGRAPHER', label: 'Photographe Passionné', threshold: 5 },
    EXPERT: { code: 'EXPERT', label: 'Expert Faune', threshold: 20 },
};

/**
 * Awards points to a user.
 */
export async function awardPoints(userId: string, amount: number, reason: string) {
    try {
        await connectToDatabase();
        // userId passed from client is Clerk ID
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $inc: { points: amount } }
        );
        console.log(`Awarded ${amount} points to ${userId} (${user ? 'found' : 'not found'}) for ${reason}`);
    } catch (error) {
        console.error("Error awarding points:", error);
    }
}

/**
 * Check and award badges based on post count.
 * Called after a post is created.
 */
export async function checkPostBadges(userId: string) {
    try {
        await connectToDatabase();

        // userId from client is Clerk ID. Resolve to Mongo User first.
        const user = await User.findOne({ clerkId: userId });
        if (!user) return;

        // Use MongoDB _id for relationship queries
        const postCount = await Post.countDocuments({ user: user._id });

        const badgesToAward = [];
        const currentBadges = user.badges.map((b: any) => b.code);

        if (postCount >= BADGES.FIRST_POST.threshold && !currentBadges.includes(BADGES.FIRST_POST.code)) {
            badgesToAward.push({ code: BADGES.FIRST_POST.code });
        }
        if (postCount >= BADGES.PHOTOGRAPHER.threshold && !currentBadges.includes(BADGES.PHOTOGRAPHER.code)) {
            badgesToAward.push({ code: BADGES.PHOTOGRAPHER.code });
        }
        if (postCount >= BADGES.EXPERT.threshold && !currentBadges.includes(BADGES.EXPERT.code)) {
            badgesToAward.push({ code: BADGES.EXPERT.code });
        }

        if (badgesToAward.length > 0) {
            await User.findByIdAndUpdate(user._id, {
                $push: { badges: { $each: badgesToAward } }
            });
            console.log(`Awarded badges to ${userId}:`, badgesToAward);
            revalidatePath('/'); // Revalidate to show new badge potentially
            revalidatePath(`/profil/${user.username}`);
        }
    } catch (error) {
        console.error("Error checking badges:", error);
    }
}

/**
 * Fetches 3 random quiz questions.
 */
export async function getDailyQuiz(): Promise<IQuizQuestion[]> {
    try {
        await connectToDatabase();

        // Random sample using MongoDB aggregation
        const questions = await QuizQuestion.aggregate([
            { $sample: { size: 5 } }
        ]);

        return questions.map((q: any) => ({
            _id: q._id.toString(),
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty,
            animal: q.animal ? q.animal.toString() : undefined,
        }));
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return [];
    }
}

/**
 * Validates quiz answer and awards points.
 */
export async function submitQuizAnswer(userId: string, questionId: string, answerIndex: number) {
    try {
        await connectToDatabase();
        const question = await QuizQuestion.findById(questionId);

        if (!question) return { success: false, correct: false };

        const isCorrect = question.correctAnswer === answerIndex;

        if (isCorrect) {
            // Points based on difficulty
            const points = question.difficulty === 'hard' ? 50 : question.difficulty === 'medium' ? 30 : 10;
            await awardPoints(userId, points, 'Quiz Correct Answer');
        }

        return { success: true, correct: isCorrect, correctIndex: question.correctAnswer };
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return { success: false, error: "Failed to submit answer" };
    }
}

/**
 * Get top users for leaderboard.
 */
export async function getLeaderboard() {
    try {
        await connectToDatabase();
        const users = await User.find({})
            .sort({ points: -1 })
            .limit(10)
            .select('username photo points badges')
            .lean();

        return users.map((user: any) => ({
            _id: user._id.toString(),
            username: user.username,
            photo: user.photo,
            points: user.points,
            badgeCount: user.badges?.length || 0,
        }));
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}
