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
}, { timestamps: true });

const Post = models.Post || model("Post", PostSchema);
export default Post;
