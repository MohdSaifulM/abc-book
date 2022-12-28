import mongoose, { Types } from "mongoose";
const jwt = require('jsonwebtoken');

// Fetch user id
export const fetchUserId = (token: string | undefined): Types.ObjectId | boolean => {
    // Return false if no token
    if (!token) return false;
    // Split bearer token to 'Bearer' string and token
    const tokenArray: string[] = token.split(" ");
    // Decode token and return user id
    const userId = jwt.decode(tokenArray[1]);
    // If not found return false
    if (!userId) return false;
    // Return user object id
    return new mongoose.Types.ObjectId(userId._id);
};
