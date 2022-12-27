import { BookType } from "../types/bookTypes";
import { model, Schema } from "mongoose";

const bookSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        enum: [
            "action_and_adventure",
            "art_architecture",
            "alternate_history",
            "autobiography",
            "biography",
            "business_economics",
            "children",
            "comicbook",
            "fantasy",
            "history",
            "humor",
            "horror",
            "philosophy",
            "poetry",
            "religion",
            "romance",
            "science_fiction",
            "self_help",
            "thriller",
            "young_adult",
            "true_crime",
        ],
        default: "fantasy",
    },
    author: {
        type: String,
        required: true,
    },
    year_published: {
        type: String,
        required: true,
    },
    borrowing_availability_status: {
        type: Boolean,
        default: false,
        required: true,
    },
    last_borrower: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        required: true
    },
});

export default model<BookType>("Book", bookSchema);
