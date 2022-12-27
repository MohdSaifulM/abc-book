import { Router } from "express";
import { editorAuthorizationCheck } from "../middleware/authorizationCheck";
import { getAllBooks, getBook, createBook, updateBook, deleteBook } from "../controllers/bookController";

const bookRoutes: Router = Router();

//?===========Authenticated Routes===========
bookRoutes.get('/all', getAllBooks);

bookRoutes.get('/:id', getBook);

//?===========Authenticated and Authorized Routes===========
bookRoutes.post('/create', editorAuthorizationCheck, createBook);

bookRoutes.put('/update/:id', editorAuthorizationCheck, updateBook);

bookRoutes.delete('/delete/:id', editorAuthorizationCheck, deleteBook);

export default bookRoutes;