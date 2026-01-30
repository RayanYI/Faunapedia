'use server';

import { connectToDatabase } from "@/lib/mongoose";
import Post from "@/models/Post";
import Animal from "@/models/Animal";

export interface MapPoint {
    id: string;
    lat: number;
    lng: number;
    title: string;
    thumbnail: string;
    type: 'post' | 'habitat';
    animalId?: string; // Link to animal page
}

/**
 * Fetches all posts that have location data.
 * Optimized for map display (lightweight).
 */
export async function getMapPosts(): Promise<MapPoint[]> {
    try {
        await connectToDatabase();

        const posts = await Post.find({
            'location.lat': { $exists: true },
            'location.lng': { $exists: true }
        })
            .select('_id location imageUrl animal caption')
            .populate('animal', 'name')
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return posts.map((post: any) => ({
            id: post._id.toString(),
            lat: post.location.lat,
            lng: post.location.lng,
            title: `Photo de ${post.animal?.name || 'Animal'}`,
            thumbnail: post.imageUrl,
            type: 'post',
            animalId: post.animal?._id.toString(),
        }));
    } catch (error) {
        console.error("Error fetching map posts:", error);
        return [];
    }
}

/**
 * Fetches native habitats for all animals.
 */
export async function getAnimalHabitats(): Promise<MapPoint[]> {
    try {
        await connectToDatabase();

        const animals = await Animal.find({
            nativeRegions: { $exists: true, $not: { $size: 0 } }
        })
            .select('_id name imageUrl nativeRegions')
            .lean();

        const points: MapPoint[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        animals.forEach((animal: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            animal.nativeRegions.forEach((region: any, index: number) => {
                points.push({
                    id: `${animal._id}-habitat-${index}`,
                    lat: region.lat,
                    lng: region.lng,
                    title: `Habitat: ${animal.name} (${region.label})`,
                    thumbnail: animal.imageUrl, // Use animal main image
                    type: 'habitat',
                    animalId: animal._id.toString(),
                });
            });
        });

        return points;
    } catch (error) {
        console.error("Error fetching animal habitats:", error);
        return [];
    }
}
