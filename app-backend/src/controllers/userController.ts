import mongoose from "mongoose";
import { Response, Request } from "express";
import { UserType } from "../types/userTypes";
import User from "../models/user";
import request from "../models/request";
import { fetchUserId } from "../utils/fetchUserId";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

import { catchAsync } from "../middleware/catchAsync";

const createToken = (_id: string) => {
    return jwt.sign({ _id }, "secret", { expiresIn: "3d" }); //! Should be placed in environment variables
};

const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ user, token });
});

const register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body;
    const user: UserType = await User.register(
        name,
        email,
        password,
        confirmPassword
    );
    const token = createToken(user._id);
    res.status(200).json({ user, token });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email } = req.body;
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const userId = fetchUserId(userToken);
    // Save request with payload
    await request.create({
        requestedBy: userId,
        isApproved: false,
        action: "add",
        payload: {
            name,
            email,
        },
    });
    res.status(200).json("Request has been successfully added");
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
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const userId = fetchUserId(userToken);
    // Save request with payload
    await request.create({
        requestedBy: userId,
        isApproved: false,
        action: "remove",
        payload: {
            _id: new mongoose.Types.ObjectId(id),
        },
    });
    res.status(200).json("Request has been successfully added");
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    if (payload.password)
        payload.password = await bcrypt.hash(payload.password, 12);
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const userId = fetchUserId(userToken);
    // Save request with payload
    await request.create({
        requestedBy: userId,
        isApproved: false,
        action: "update",
        payload: {
            ...payload,
            _id: new mongoose.Types.ObjectId(id),
        },
    });
    res.status(200).json("Request has been successfully added");
});

const updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;
    const userToken: string | undefined = req.get("Authorization");
    const userId = fetchUserId(userToken);
    if (!userId || typeof userId === 'boolean') return res.status(500).json('Something went wrong');
    await User.updatePassword(password, confirmPassword, userId);
    res.status(200).json('Successfully updated password!');
});

export {
    register,
    login,
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
    updatePassword,
};
