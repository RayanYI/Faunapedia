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
}, { timestamps: true });

const Animal = models.Animal || model("Animal", AnimalSchema);
export default Animal;
