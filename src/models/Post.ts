import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    animal: {
        type: Schema.Types.ObjectId,
        ref: "Animal",
        required: true,
    },
    caption: {
        type: String,
    },
    likes: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    location: {
        lat: Number,
        lng: Number,
        placeName: String,
    },
    takenAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for comment count (we will implement the Comment model next)
PostSchema.virtual('commentCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true
});

const Post = models.Post || model("Post", PostSchema);
export default Post;
