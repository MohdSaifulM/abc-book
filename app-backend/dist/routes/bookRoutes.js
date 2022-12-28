"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorizationCheck_1 = require("../middleware/authorizationCheck");
const bookController_1 = require("../controllers/bookController");
const bookRoutes = (0, express_1.Router)();
//?===========Authenticated Routes===========
bookRoutes.get('/all', bookController_1.getAllBooks);
bookRoutes.get('/:id', bookController_1.getBook);
bookRoutes.post('/borrow/:id', bookController_1.borrowBook);
bookRoutes.post('/return/:id', bookController_1.returnBook);
//?===========Authenticated and Authorized Routes===========
bookRoutes.post('/create', authorizationCheck_1.editorAuthorizationCheck, bookController_1.createBook);
bookRoutes.put('/update/:id', authorizationCheck_1.editorAuthorizationCheck, bookController_1.updateBook);
bookRoutes.delete('/delete/:id', authorizationCheck_1.editorAuthorizationCheck, bookController_1.deleteBook);
exports.default = bookRoutes;
