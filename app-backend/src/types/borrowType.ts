import { Document, Types } from 'mongoose';

export interface BorrowType extends Document {
    book_id: Types.ObjectId,
    user_id: Types.ObjectId,
    isReturned: boolean
}