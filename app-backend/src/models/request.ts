import { model, Schema } from "mongoose";
import { RequestType } from "../types/requestTypes";

const requestSchema = new Schema({
    requestedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isApproved: {
        type: Boolean,
        required: true
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        enum: ['add', 'remove', 'update'],
        required: true
    },
    payload: {
        _id: Schema.Types.ObjectId,
        name: String,
        email: String,
        role: String,
        password: String
    }
});

export default model<RequestType>("Request", requestSchema);
