"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationCheck_1 = require("../middleware/authenticationCheck");
const authorizationCheck_1 = require("../middleware/authorizationCheck");
const userController_1 = require("../controllers/userController");
const userRoutes = (0, express_1.Router)();
//?===========Unprotected Routes===========
userRoutes.post('/login', userController_1.login);
userRoutes.post('/register', userController_1.register);
//?===========Protected Routes - Needs to be authenticated===========
userRoutes.put('/update-password', authenticationCheck_1.authenticationCheck, userController_1.updatePassword);
//?===========Protected Routes - Needs to be at least Editor===========
userRoutes.get('/all', authenticationCheck_1.authenticationCheck, authorizationCheck_1.editorAuthorizationCheck, userController_1.getAllUsers);
userRoutes.get('/:id', authenticationCheck_1.authenticationCheck, authorizationCheck_1.editorAuthorizationCheck, userController_1.getUser);
//?===========Protected Routes - Needs to be Admin===========
userRoutes.post('/create', authenticationCheck_1.authenticationCheck, authorizationCheck_1.adminAuthorizationCheck, userController_1.createUser);
userRoutes.delete('/delete/:id', authenticationCheck_1.authenticationCheck, authorizationCheck_1.adminAuthorizationCheck, userController_1.deleteUser);
userRoutes.put('/update/:id', authenticationCheck_1.authenticationCheck, authorizationCheck_1.adminAuthorizationCheck, userController_1.updateUser);
exports.default = userRoutes;
