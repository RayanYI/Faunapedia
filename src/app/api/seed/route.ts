import { connectToDatabase } from "@/lib/mongoose";
import Animal from "@/models/Animal";
import { NextResponse } from "next/server";

const INITIAL_ANIMALS = [
    {
        name: "Lion",
        scientificName: "Panthera leo",
        description: "Le roi de la jungle, connu pour sa crinière majestueuse.",
        imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Éléphant d'Afrique",
        scientificName: "Loxodonta africana",
        description: "Le plus grand mammifère terrestre, doté d'une intelligence remarquable.",
        imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Panda Géant",
        scientificName: "Ailuropoda melanoleuca",
        description: "Symbole de la conservation, il passe sa vie à manger du bambou.",
        imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Aigle Royal",
        scientificName: "Aquila chrysaetos",
        description: "Un rapace redoutable avec une vue perçante.",
        imageUrl: "https://images.unsplash.com/photo-1580019542155-247062e19ce4?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Dauphin",
        scientificName: "Delphinidae",
        description: "Mammifère marin très intelligent et social.",
        imageUrl: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Tigre du Bengale",
        scientificName: "Panthera tigris tigris",
        description: "Le plus grand des félins, un chasseur solitaire et puissant.",
        imageUrl: "https://images.unsplash.com/photo-1506509939527-5ae55a88c949?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Girafe",
        scientificName: "Giraffa",
        description: "Le plus grand animal terrestre, reconnaissable à son long cou.",
        imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Koala",
        scientificName: "Phascolarctos cinereus",
        description: "Marsupial australien qui dort jusqu'à 20 heures par jour.",
        imageUrl: "https://images.unsplash.com/photo-1540573133985-00c69d5033d4?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Loup Gris",
        scientificName: "Canis lupus",
        description: "Ancêtre du chien domestique, vivant en meutes organisées.",
        imageUrl: "https://images.unsplash.com/photo-1491290333245-56543ce9c2c6?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Manchot Empereur",
        scientificName: "Aptenodytes forsteri",
        description: "Le plus grand des manchots, capable de surmonter le froid antarctique.",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80",
    }
];

export async function GET() {
    try {
        await connectToDatabase();

        // Optional: Clear existing animals to avoid duplicates during dev
        // await Animal.deleteMany({}); 

        for (const animal of INITIAL_ANIMALS) {
            await Animal.findOneAndUpdate(
                { name: animal.name },
                animal,
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({
            message: "Database seeded successfully",
            count: INITIAL_ANIMALS.length
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
