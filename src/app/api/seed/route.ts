import { connectToDatabase } from "@/lib/mongoose";
import Animal from "@/models/Animal";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

const INITIAL_ANIMALS = [
    {
        name: "Lion",
        scientificName: "Panthera leo",
        description: "Le roi de la jungle, connu pour sa crinière majestueuse.",
        imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: -2.333333, lng: 34.833333, label: "Serengeti, Tanzanie" },
            { lat: -19.0154, lng: 29.1549, label: "Parc Hwange, Zimbabwe" }
        ]
    },
    {
        name: "Éléphant d'Afrique",
        scientificName: "Loxodonta africana",
        description: "Le plus grand mammifère terrestre, doté d'une intelligence remarquable.",
        imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: -18.6657, lng: 35.5296, label: "Parc Gorongosa, Mozambique" },
            { lat: -1.2921, lng: 36.8219, label: "Parc Nairobi, Kenya" }
        ]
    },
    {
        name: "Panda Géant",
        scientificName: "Ailuropoda melanoleuca",
        description: "Symbole de la conservation, il passe sa vie à manger du bambou.",
        imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: 30.7, lng: 103.0, label: "Sichuan, Chine" }
        ]
    },
    {
        name: "Aigle Royal",
        scientificName: "Aquila chrysaetos",
        description: "Un rapace redoutable avec une vue perçante.",
        imageUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80",
        category: "Oiseau",
        nativeRegions: [
            { lat: 45.0, lng: 6.0, label: "Alpes, France" },
            { lat: 56.4907, lng: -4.2026, label: "Highlands, Écosse" }
        ]
    },
    {
        name: "Dauphin",
        scientificName: "Delphinidae",
        description: "Mammifère marin très intelligent et social.",
        imageUrl: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: 25.0, lng: -77.3, label: "Bahamas" },
            { lat: -22.9, lng: -43.1, label: "Rio de Janeiro, Brésil" }
        ]
    },
    {
        name: "Tigre du Bengale",
        scientificName: "Panthera tigris tigris",
        description: "Le plus grand des félins, un chasseur solitaire et puissant.",
        imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: 23.6, lng: 80.8, label: "Parc Bandhavgarh, Inde" }
        ]
    },
    {
        name: "Girafe",
        scientificName: "Giraffa",
        description: "Le plus grand animal terrestre, reconnaissable à son long cou.",
        imageUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: -2.3, lng: 34.8, label: "Serengeti, Tanzanie" }
        ]
    },
    {
        name: "Koala",
        scientificName: "Phascolarctos cinereus",
        description: "Marsupial australien qui dort jusqu'à 20 heures par jour.",
        imageUrl: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: -27.4, lng: 153.0, label: "Queensland, Australie" }
        ]
    },
    {
        name: "Loup Gris",
        scientificName: "Canis lupus",
        description: "Ancêtre du chien domestique, vivant en meutes organisées.",
        imageUrl: "https://plus.unsplash.com/premium_photo-1661877753653-755a71abd411?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
        nativeRegions: [
            { lat: 44.8, lng: -110.5, label: "Yellowstone, USA" },
            { lat: 44.2, lng: 6.8, label: "Mercantour, France" }
        ]
    },
    {
        name: "Manchot Empereur",
        scientificName: "Aptenodytes forsteri",
        description: "Le plus grand des manchots, capable de surmonter le froid antarctique.",
        imageUrl: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80",
        category: "Oiseau",
        nativeRegions: [
            { lat: -77.0, lng: 167.0, label: "Mer de Ross, Antarctique" }
        ]
    }
];

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Update Animals with regions
        for (const animal of INITIAL_ANIMALS) {
            await Animal.findOneAndUpdate(
                { name: animal.name },
                { $set: { ...animal } }, // Update all fields including new nativeRegions
                { upsert: true, new: true }
            );
        }

        // 2. Add random coordinates to existing posts without location
        const postsWithoutLocation = await Post.find({
            $or: [
                { location: { $exists: false } },
                { 'location.lat': { $exists: false } }
            ]
        });

        const updatedPosts = [];
        for (const post of postsWithoutLocation) {
            // Generate random coords around strict nature spots or just global random for MVP fun
            // Let's bias towards Africa/Europe for demo density
            const lat = (Math.random() * 60) - 30; // -30 to +30 latitude
            const lng = (Math.random() * 60) - 20; // -20 to +40 longitude

            post.location = {
                lat,
                lng,
                placeName: "Lieu inconnu (Simulé)"
            };
            // Add a random past date for takenAt
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            post.takenAt = date;

            await post.save();
            updatedPosts.push(post._id);
        }

        revalidatePath('/');

        return NextResponse.json({
            message: "Database seeded and migrated successfully",
            animalsCount: INITIAL_ANIMALS.length,
            postsUpdated: updatedPosts.length
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
