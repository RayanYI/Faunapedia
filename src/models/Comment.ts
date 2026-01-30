import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
}, { timestamps: true });

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
