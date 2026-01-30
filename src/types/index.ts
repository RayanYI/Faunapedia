export interface ILocation {
    lat: number;
    lng: number;
    placeName?: string;
    label?: string;
}

export interface IAnimal {
    _id: string;
    name: string;
    scientificName?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    nativeRegions?: ILocation[];
    createdAt: string;
    updatedAt: string;
}

export interface IPost {
    _id: string;
    imageUrl: string;
    user: IUser | string; // Populated or ID
    animal: IAnimal | string; // Populated or ID
    caption?: string;
    likes: string[]; // Array of User IDs
    isLiked?: boolean; // Computed field for current user
    location?: ILocation;
    takenAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IComment {
    _id: string;
    content: string;
    user: IUser | string;
    post: string;
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
