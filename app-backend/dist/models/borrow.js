"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        isRequired: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        isRequired: true,
    },
    isReturned: {
        type: Boolean,
        isRequired: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Borrow", borrowSchema);
