import { BorrowType } from "../types/borrowType";
import { model, Schema } from "mongoose";

const borrowSchema: Schema = new Schema(
    {
        book_id: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            isRequired: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            isRequired: true,
        },
        isReturned: {
            type: Boolean,
            isRequired: true,
        },
    },
    { timestamps: true }
);

export default model<BorrowType>("Borrow", borrowSchema);
