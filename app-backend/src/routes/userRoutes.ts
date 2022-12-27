import { Router } from "express";
import { authenticationCheck } from "../middleware/authenticationCheck";
import { adminAuthorizationCheck, editorAuthorizationCheck } from "../middleware/authorizationCheck";
import { getAllUsers, login, register, createUser, getUser, deleteUser, updateUser } from '../controllers/userController';

const userRoutes: Router = Router();

//?===========Unprotected Routes===========
userRoutes.post('/login', login);

userRoutes.post('/register', register);

//?===========Protected Routes - Needs to be at least Editor===========
userRoutes.get('/getAllUsers', authenticationCheck, editorAuthorizationCheck, getAllUsers);

userRoutes.get('/:id', authenticationCheck, editorAuthorizationCheck, getUser);

//?===========Protected Routes - Needs to be Admin===========
userRoutes.post('/createUser', authenticationCheck, adminAuthorizationCheck, createUser);

userRoutes.delete('/delete/:id', authenticationCheck, adminAuthorizationCheck, deleteUser);

userRoutes.put('/update/:id', authenticationCheck, adminAuthorizationCheck, updateUser);

export default userRoutes;