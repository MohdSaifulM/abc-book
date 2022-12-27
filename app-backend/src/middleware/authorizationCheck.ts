import { Request, Response, NextFunction } from "express";
import User from './../models/user';
import { UserType } from "../types/userTypes";
const jwt = require('jsonwebtoken');

const checkIfAuthorized = async (token: string | undefined, allowEditor: boolean): Promise<boolean> => {
    // Return false if no token
    if (!token) return false;
    // Split bearer token to 'Bearer' string and token
    const tokenArray: string[] = token.split(" ");
    // Decode token and return user id
    const userId = jwt.decode(tokenArray[1]);
    // Find user from db
    const user: UserType | null = await User.findById(userId);
    // If not found return false
    if (!user) return false;
    // Return false if user role is not authorized
    return allowEditor ? ['admin', 'editor'].includes(user.role) : user.role === 'admin';
}

// Check if current user is authorized to make request
export const adminAuthorizationCheck = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.get('Authorization');
    const isAuthenticated = await checkIfAuthorized(token, false);
    if (!isAuthenticated) return res.status(403).json('You are not authorized');
    return next();
}

export const editorAuthorizationCheck = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.get('Authorization');
    const isAuthenticated = await checkIfAuthorized(token, true);
    if (!isAuthenticated) return res.status(403).json('You are not authorized');
    return next();
}