import { Router } from "express";
import { editorAuthorizationCheck } from "../middleware/authorizationCheck";
import { getAllBooks, getBook, createBook, updateBook, deleteBook, borrowBook } from "../controllers/bookController";

const bookRoutes: Router = Router();

//?===========Authenticated Routes===========
bookRoutes.get('/all', getAllBooks);

bookRoutes.get('/:id', getBook);

bookRoutes.post('/borrow/:id', borrowBook);

//?===========Authenticated and Authorized Routes===========
bookRoutes.post('/create', editorAuthorizationCheck, createBook);

bookRoutes.put('/update/:id', editorAuthorizationCheck, updateBook);

bookRoutes.delete('/delete/:id', editorAuthorizationCheck, deleteBook);

export default bookRoutes;