import mongoose, { Schema, model, models } from "mongoose";

const QuizQuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
    },
    animal: {
        type: Schema.Types.ObjectId,
        ref: "Animal",
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
}, { timestamps: true });

const QuizQuestion = models.QuizQuestion || model("QuizQuestion", QuizQuestionSchema);

export default QuizQuestion;
