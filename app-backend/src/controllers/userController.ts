import { Response, Request  } from 'express'
import { UserType } from '../types/userTypes'
import User from '../models/user';
const jwt = require('jsonwebtoken');

import { catchAsync } from '../middleware/catchAsync';

const createToken = (_id: string) => {
    return jwt.sign({ _id }, { expiresIn: '3d' });
}

const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await User.login(email, password)
    const token = createToken(user._id);
    res.status(200).json({ user, token });
});

const register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body;
    const user: UserType = await User.register(name, email, password, confirmPassword);
    const token = createToken(user._id);
    res.status(200).json({ user, token });
});

export { register, login }