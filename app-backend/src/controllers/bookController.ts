import mongoose from "mongoose";
import { Request, Response } from "express";
import { BookType } from "../types/bookTypes";
import { catchAsync } from "../middleware/catchAsync";
import Book from "../models/book";

// Look up last borrower from user collection for book aggregation
const lookup = {
    $lookup: {
        from: "users",
        localField: "last_borrower",
        foreignField: "_id",
        as: "last_borrower",
    },
};
// Unwind to flatten array since we're returning just one user
const unwind = {
    $unwind: {
        path: "$last_borrower",
        preserveNullAndEmptyArrays: true,
    },
};

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
    const books: BookType[] = await Book.aggregate([lookup, unwind]);
    res.status(200).json(books);
});

const getBook = catchAsync(async (req: Request, res: Response) => {
    const oid = new mongoose.Types.ObjectId(req.params.id);
    const query = {
        $match: {
            _id: oid,
        },
    };
    const book: BookType[] = await Book.aggregate([query, lookup, unwind]);
    res.status(200).json(book[0]);
});

const createBook = catchAsync(async (req: Request, res: Response) => {
    const { title, description, genre, author, year_published, quantity } =
        req.body;
    const book = await Book.create({
        title,
        description,
        genre,
        author,
        year_published,
        quantity,
        borrowing_availability_status: quantity ? true : false,
    });
    res.status(200).json(book);
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    
    // Set borrowing availability status based on quantity
    if (payload.quantity) payload.borrowing_availability_status = true;
    else payload.borrowing_availability_status = false;

    const updatedBook: BookType | null = await Book.findByIdAndUpdate(
        id,
        {
            $set: payload,
        },
        { returnOriginal: false }
    );
    res.status(200).json(updatedBook);
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json(`Successfully deleted book :: ${id}`);
});

export { getAllBooks, getBook, createBook, updateBook, deleteBook };
