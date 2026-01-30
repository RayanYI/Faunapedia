import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    photo: {
        type: String,
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    points: {
        type: Number,
        default: 0,
    },
    badges: [{
        code: String,
        earnedAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

const User = models.User || model("User", UserSchema);

export default User;
