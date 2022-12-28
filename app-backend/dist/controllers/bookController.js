"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnBook = exports.borrowBook = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = require("../middleware/catchAsync");
const fetchUserId_1 = require("../utils/fetchUserId");
const book_1 = __importDefault(require("../models/book"));
const borrow_1 = __importDefault(require("../models/borrow"));
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
        title: { $first: '$title' },
        description: { $first: '$description' },
        genre: { $first: '$genre' },
        author: { $first: '$author' },
        year_published: { $first: '$year_published' },
        borrowing_availability_status: { $first: '$borrowing_availability_status' },
        last_borrower: { $first: '$last_borrower' },
        quantity: { $first: '$quantity' },
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
const fetchBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_1.default.findById(id, {
        title: 1,
        borrowing_availability_status: 1,
        quantity: 1,
        borrow_history: 1,
    });
});
//?===========Exported Functions for Routes===========
const getAllBooks = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield book_1.default.aggregate([
        lookupLastBorrower,
        unwindLastBorrower,
        lookupBorrowHistory,
        unwindBorrowHistory,
        lookupBorrowHistoryUser,
        unwindBorrowHistoryUser,
        bookProject
    ]);
    res.status(200).json(books);
}));
exports.getAllBooks = getAllBooks;
const getBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oid = new mongoose_1.default.Types.ObjectId(req.params.id);
    const query = {
        $match: {
            _id: oid,
        },
    };
    const book = yield book_1.default.aggregate([
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
}));
exports.getBook = getBook;
const createBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, genre, author, year_published, quantity } = req.body;
    const book = yield book_1.default.create({
        title,
        description,
        genre,
        author,
        year_published,
        quantity,
        borrowing_availability_status: quantity ? true : false,
    });
    res.status(200).json(book);
}));
exports.createBook = createBook;
const updateBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    // Set borrowing availability status based on quantity
    if (payload.quantity)
        payload.borrowing_availability_status = true;
    else
        payload.borrowing_availability_status = false;
    const updatedBook = yield book_1.default.findByIdAndUpdate(id, {
        $set: payload,
    }, { returnOriginal: false });
    res.status(200).json(updatedBook);
}));
exports.updateBook = updateBook;
const deleteBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield book_1.default.findByIdAndDelete(id);
    res.status(200).json(`Successfully deleted book :: ${id}`);
}));
exports.deleteBook = deleteBook;
const borrowBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch book
    const { id } = req.params;
    const book = yield fetchBook(id);
    // Fetch user id
    const userToken = req.get("Authorization");
    const userId = (0, fetchUserId_1.fetchUserId)(userToken);
    // Create borrow if quantity is > 1
    if (book && book.borrowing_availability_status && userId) {
        const borrow = yield borrow_1.default.create({
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
        const updatedBook = yield book_1.default.findByIdAndUpdate(id, payload, {
            returnOriginal: false,
        });
        // Return updated book
        res.status(200).json(updatedBook);
    }
    else {
        // Return message that book is not available for borrow
        res.status(200).json(`${book && book.title ? book.title : "Book"} is not available for borrow`);
    }
}));
exports.borrowBook = borrowBook;
const returnBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch book
    const { id } = req.params;
    const book = yield fetchBook(id);
    // Return message if unable to find book
    if (!book)
        return res.status(200).json('Unable to find book that matches query');
    // Fetch user id
    const userToken = req.get("Authorization");
    const userId = (0, fetchUserId_1.fetchUserId)(userToken);
    // Find and update borrow
    const borrow = yield borrow_1.default.findOneAndUpdate({
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
        const updatedBook = yield book_1.default.findByIdAndUpdate(id, payload, {
            returnOriginal: false,
        });
        // Return updated book
        res.status(200).json(updatedBook);
    }
    else {
        // Return message that not available to find borrow record
        res.status(200).json('Unable to find borrow record for book');
    }
}));
exports.returnBook = returnBook;
