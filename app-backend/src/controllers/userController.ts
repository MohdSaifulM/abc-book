import { Response, Request  } from 'express';
import { UserType } from '../types/userTypes';
import User from '../models/user';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import { catchAsync } from '../middleware/catchAsync';

const createToken = (_id: string) => {
    return jwt.sign({ _id }, 'secret', { expiresIn: '3d' });    //! Should be placed in environment variables
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

const createUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user: UserType = await User.createUser(name, email);
    res.status(200).json({ user });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users: UserType[] = await User.find({});
    res.status(200).json(users);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user: UserType | null = await User.findById(id);
    res.status(200).json(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json(`Successfully deleted user :: ${id}`);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    if (payload.password) payload.password = await bcrypt.hash(payload.password, 12);
    const updatedUser: UserType | null = await User.findByIdAndUpdate(id, {
        $set: payload
    });
    res.status(200).json(updatedUser);
});


export { register, login, getAllUsers, createUser, getUser, deleteUser, updateUser };