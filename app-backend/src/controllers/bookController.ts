import mongoose from "mongoose";
import { Request, Response } from "express";
import { BookType } from "../types/bookTypes";
import { BorrowType } from "../types/borrowTypes";
import { catchAsync } from "../middleware/catchAsync";
import { fetchUserId } from "../utils/fetchUserId";
import Book from "../models/book";
import Borrow from "../models/borrow";

const jwt = require("jsonwebtoken");


//?===========Aggregations===========
// Look up last borrower from user collection for book aggregation
const lookupLastBorrower = {
    $lookup: {
        from: "users",
        localField: "last_borrower",
        foreignField: "_id",
        as: "last_borrower",
    },
};

// Look up last borrower from user collection for book aggregation
const lookupBorrowHistory = {
    $lookup: {
        from: "borrows",
        localField: "borrow_history",
        foreignField: "_id",
        as: "borrow_history",
    },
};

// Unwind to flatten borrow history array to look up for user or book from borrow history
const unwindBorrowHistory = {
    $unwind: {
        path: "$borrow_history",
        preserveNullAndEmptyArrays: true,
    },
};

// Look up user from borrow history array
const lookupBorrowHistoryUser = {
    $lookup: {
        from: "users",
        localField: "borrow_history.user_id",
        foreignField: "_id",
        as: "borrow_history.user_id",
    },
};

// Unwind borrow history user since we're returning just one user from this
const unwindBorrowHistoryUser = {
    $unwind: {
        path: "$borrow_history.user_id",
        preserveNullAndEmptyArrays: true,
    },
};

// Unwind to flatten array since we're returning just one user
const unwindLastBorrower = {
    $unwind: {
        path: "$last_borrower",
        preserveNullAndEmptyArrays: true,
    },
};

// Return correct book object populated with borrow history and user data
const bookProject = {
    $group: {
        _id: '$_id',
        title: {$first: '$title'},
        description: {$first: '$description'},
        genre: {$first: '$genre'},
        author: {$first: '$author'},
        year_published: {$first: '$year_published'},
        borrowing_availability_status: {$first: '$borrowing_availability_status'},
        last_borrower: {$first: '$last_borrower'},
        quantity: {$first: '$quantity'},
        borrow_history: {
          $push: {
            _id: '$borrow_history._id',
            user: '$borrow_history.user_id',
            isReturned: '$borrow_history.isReturned'
          }
        }
    },
};

//?===========Local Functions===========
// Fetch book and return borrowing_availability_status, quantity and borrow_history
const fetchBook = async (id: string): Promise<BookType | null> => {
    return await Book.findById(id, {
        title: 1,
        borrowing_availability_status: 1,
        quantity: 1,
        borrow_history: 1,
    });
};

//?===========Exported Functions for Routes===========
const getAllBooks = catchAsync(async (req: Request, res: Response) => {
    const books: BookType[] = await Book.aggregate([
        lookupLastBorrower,
        unwindLastBorrower,
        lookupBorrowHistory,
        unwindBorrowHistory,
        lookupBorrowHistoryUser,
        unwindBorrowHistoryUser,
        bookProject
    ]);
    res.status(200).json(books);
});

const getBook = catchAsync(async (req: Request, res: Response) => {
    const oid = new mongoose.Types.ObjectId(req.params.id);
    const query = {
        $match: {
            _id: oid,
        },
    };
    const book: BookType[] = await Book.aggregate([
        query,
        lookupLastBorrower,
        unwindLastBorrower,
        lookupBorrowHistory,
        unwindBorrowHistory,
        lookupBorrowHistoryUser,
        unwindBorrowHistoryUser,
        bookProject
    ]);
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

const borrowBook = catchAsync(async (req: Request, res: Response) => {
    // Fetch book
    const { id } = req.params;
    const book: BookType | null = await fetchBook(id);
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const userId = fetchUserId(userToken);
    // Create borrow if quantity is > 1
    if (book && book.borrowing_availability_status && userId) {
        const borrow: BorrowType = await Borrow.create({
            book_id: book._id,
            user_id: userId,
            isReturned: false,
        });
        // Update book quantity, last_borrowed, borrowing_availability_status and borrow_history
        const updatedQuantity = book.quantity - 1;
        book.borrow_history.push(borrow._id);
        const payload = {
            quantity: updatedQuantity,
            last_borrower: userId,
            borrowing_availability_status: updatedQuantity ? true : false,
            borrow_history: book.borrow_history,
        };
        const updatedBook = await Book.findByIdAndUpdate(id, payload, {
            returnOriginal: false,
        });
        // Return updated book
        res.status(200).json(updatedBook);
    } else {
        // Return message that book is not available for borrow
        res.status(200).json(`${book && book.title ? book.title : "Book"} is not available for borrow`);
    }
});

const returnBook = catchAsync(async (req: Request, res: Response) => {
    // Fetch book
    const { id } = req.params;
    const book: BookType | null = await fetchBook(id);
    // Return message if unable to find book
    if (!book) return res.status(200).json('Unable to find book that matches query');
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const userId = fetchUserId(userToken);
    // Find and update borrow
    const borrow: BorrowType | null = await Borrow.findOneAndUpdate({
        book_id: book._id,
        user_id: userId,
        isReturned: false
    }, {
        isReturned: true
    }, { returnOriginal: false });
    // Update book quantity and borrowing_availability_status
    if (borrow && borrow.isReturned) {
        const updatedQuantity = book.quantity + 1;
        const payload = {
            quantity: updatedQuantity,
            borrowing_availability_status: updatedQuantity ? true : false,
        };
        const updatedBook = await Book.findByIdAndUpdate(id, payload, {
            returnOriginal: false,
        });
        // Return updated book
        res.status(200).json(updatedBook);
    } else {
        // Return message that not available to find borrow record
        res.status(200).json('Unable to find borrow record for book');
    }
});

export {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
};
