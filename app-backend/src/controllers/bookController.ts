import { Request, Response } from "express";
import { UserType } from "../types/userTypes";
import { BookType } from "../types/bookTypes";
import { catchAsync } from "../middleware/catchAsync";
import User from '../models/user';
import Book from '../models/book';

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
    const books: BookType[] = await Book.aggregate([{
        $lookup: {
            from: 'users',
            localField: 'last_borrower',
            foreignField: '_id',
            as: 'last_borrower'
        }
    }, {
        $unwind: {
            path: "$last_borrower",
            preserveNullAndEmptyArrays: true
        }
    }]);
    res.status(200).json(books);
});

export { getAllBooks };