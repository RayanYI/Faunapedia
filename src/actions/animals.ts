'use server';

import { connectToDatabase } from "@/lib/mongoose";
import Animal from "@/models/Animal";
import { IAnimal } from "@/types";

/**
 * Fetches all animals from the database.
 * Returns a plain object suitable for Client Components.
 */
export async function getAnimals(): Promise<IAnimal[]> {
    try {
        await connectToDatabase();
        const animals = await Animal.find({}).sort({ name: 1 }).lean();

        // Serialize MongoDB objects (convert _id to string, dates to ISO strings)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return animals.map((animal: any) => ({
            ...animal,
            _id: animal._id.toString(),
            createdAt: animal.createdAt.toISOString(),
            updatedAt: animal.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching animals:", error);
        return [];
    }
}

/**
 * searches for animals by name.
 */
export async function searchAnimals(query: string): Promise<IAnimal[]> {
    if (!query) return [];

    try {
        await connectToDatabase();
        const animals = await Animal.find({
            name: { $regex: query, $options: 'i' }
        }).limit(5).lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return animals.map((animal: any) => ({
            ...animal,
            _id: animal._id.toString(),
            createdAt: animal.createdAt.toISOString(),
            updatedAt: animal.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error searching animals:", error);
        return [];
    }
}
