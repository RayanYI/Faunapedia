export interface IAnimal {
    _id: string;
    name: string;
    scientificName?: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPost {
    _id: string;
    imageUrl: string;
    user: IUser | string; // Populated or ID
    animal: IAnimal | string; // Populated or ID
    caption?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    _id: string;
    clerkId: string;
    email: string;
    username?: string;
    photo?: string;
    following: string[];
    createdAt: string;
    updatedAt: string;
}
