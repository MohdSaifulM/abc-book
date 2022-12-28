"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const requestSchema = new mongoose_1.Schema({
    requestedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isApproved: {
        type: Boolean,
        required: true
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        enum: ['add', 'remove', 'update'],
        required: true
    },
    payload: {
        _id: mongoose_1.Schema.Types.ObjectId,
        name: String,
        email: String,
        role: String,
        password: String
    }
});
exports.default = (0, mongoose_1.model)("Request", requestSchema);
