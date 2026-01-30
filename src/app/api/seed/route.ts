import { connectToDatabase } from "@/lib/mongoose";
import Animal from "@/models/Animal";
import { NextResponse } from "next/server";

const INITIAL_ANIMALS = [
    {
        name: "Lion",
        scientificName: "Panthera leo",
        description: "Le roi de la jungle, connu pour sa crinière majestueuse.",
        imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Éléphant d'Afrique",
        scientificName: "Loxodonta africana",
        description: "Le plus grand mammifère terrestre, doté d'une intelligence remarquable.",
        imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Panda Géant",
        scientificName: "Ailuropoda melanoleuca",
        description: "Symbole de la conservation, il passe sa vie à manger du bambou.",
        imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Aigle Royal",
        scientificName: "Aquila chrysaetos",
        description: "Un rapace redoutable avec une vue perçante.",
        imageUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80",
        category: "Oiseau",
    },
    {
        name: "Dauphin",
        scientificName: "Delphinidae",
        description: "Mammifère marin très intelligent et social.",
        imageUrl: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Tigre du Bengale",
        scientificName: "Panthera tigris tigris",
        description: "Le plus grand des félins, un chasseur solitaire et puissant.",
        imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Girafe",
        scientificName: "Giraffa",
        description: "Le plus grand animal terrestre, reconnaissable à son long cou.",
        imageUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Koala",
        scientificName: "Phascolarctos cinereus",
        description: "Marsupial australien qui dort jusqu'à 20 heures par jour.",
        imageUrl: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Loup Gris",
        scientificName: "Canis lupus",
        description: "Ancêtre du chien domestique, vivant en meutes organisées.",
        imageUrl: "https://plus.unsplash.com/premium_photo-1661877753653-755a71abd411?auto=format&fit=crop&w=800&q=80",
        category: "Mammifère",
    },
    {
        name: "Manchot Empereur",
        scientificName: "Aptenodytes forsteri",
        description: "Le plus grand des manchots, capable de surmonter le froid antarctique.",
        imageUrl: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80",
        category: "Oiseau",
    }
];

import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        for (const animal of INITIAL_ANIMALS) {
            await Animal.findOneAndUpdate(
                { name: animal.name },
                animal,
                { upsert: true, new: true }
            );
        }

        // Revalidate the home page and animal detail cache
        revalidatePath('/');

        return NextResponse.json({
            message: "Database seeded successfully",
            count: INITIAL_ANIMALS.length
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
