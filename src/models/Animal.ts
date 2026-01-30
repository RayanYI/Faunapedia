import mongoose, { Schema, model, models } from "mongoose";

const AnimalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    scientificName: {
        type: String,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    category: {
        type: String,
        enum: ["Mammifère", "Oiseau", "Reptile", "Amphibien", "Poisson", "Invertébré"],
        index: true,
    },
    nativeRegions: [{
        lat: Number,
        lng: Number,
        label: String,
    }],
}, { timestamps: true });

const Animal = models.Animal || model("Animal", AnimalSchema);
export default Animal;
