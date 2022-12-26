import { Router } from "express";
import { getAllUsers, login, register, createUser, getUser, deleteUser, updateUser } from '../controllers/userController';

const userRoutes: Router = Router();

userRoutes.post('/login', login);

userRoutes.post('/register', register);

userRoutes.post('/createUser', createUser);

userRoutes.get('/getAllUsers', getAllUsers);

userRoutes.get('/:id', getUser);

userRoutes.delete('/delete/:id', deleteUser);

userRoutes.put('/update/:id', updateUser);

export default userRoutes;