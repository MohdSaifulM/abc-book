"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require('jsonwebtoken');
// Fetch user id
const fetchUserId = (token) => {
    // Return false if no token
    if (!token)
        return false;
    // Split bearer token to 'Bearer' string and token
    const tokenArray = token.split(" ");
    // Decode token and return user id
    const userId = jwt.decode(tokenArray[1]);
    // If not found return false
    if (!userId)
        return false;
    // Return user object id
    return new mongoose_1.default.Types.ObjectId(userId._id);
};
exports.fetchUserId = fetchUserId;
