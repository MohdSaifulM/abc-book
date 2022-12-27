import { Router } from "express";
import { editorAuthorizationCheck } from "../middleware/authorizationCheck";
import { getAllBooks } from "../controllers/bookController";

const bookRoutes: Router = Router();

//?===========Authenticated Routes===========
bookRoutes.get('/all', getAllBooks);

export default bookRoutes;