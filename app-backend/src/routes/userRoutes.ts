import { Router } from "express";
import { login, register } from '../controllers/userController';

const userRoutes: Router = Router();

userRoutes.post('/login', login);

userRoutes.post('/register', register);

export default userRoutes;