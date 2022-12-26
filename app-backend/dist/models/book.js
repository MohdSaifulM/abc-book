"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
        type: String
    },
    quantity: {
        type: Number
    },
});
exports.default = (0, mongoose_1.model)("Book", bookSchema);
