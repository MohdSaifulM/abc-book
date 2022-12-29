import { Router } from "express";
import { authenticationCheck } from "../middleware/authenticationCheck";
import { adminAuthorizationCheck, editorAuthorizationCheck } from "../middleware/authorizationCheck";
import { getAllUsers, login, register, createUser, getUser, deleteUser, updateUser, updatePassword } from '../controllers/userController';

const userRoutes: Router = Router();

//?===========Unprotected Routes===========
userRoutes.post('/login', login);

userRoutes.post('/register', register);

//?===========Protected Routes - Needs to be authenticated===========
userRoutes.put('/update-password', authenticationCheck, updatePassword);

//?===========Protected Routes - Needs to be at least Editor===========
userRoutes.get('/all', authenticationCheck, editorAuthorizationCheck, getAllUsers);

userRoutes.get('/:id', authenticationCheck, editorAuthorizationCheck, getUser);

//?===========Protected Routes - Needs to be Admin===========
userRoutes.post('/create', authenticationCheck, adminAuthorizationCheck, createUser);

userRoutes.post('/delete/:id', authenticationCheck, adminAuthorizationCheck, deleteUser);

userRoutes.post('/update/:id', authenticationCheck, adminAuthorizationCheck, updateUser);

export default userRoutes;