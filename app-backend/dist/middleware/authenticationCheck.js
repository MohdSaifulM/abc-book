"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationCheck = void 0;
const jwt = require('jsonwebtoken');
const checkIfAuthenticated = (token) => {
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
    // Return true if user is authenticated
    return true;
};
// Check if current user is authenticated to make request
const authenticationCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get('Authorization');
    const isAuthenticated = checkIfAuthenticated(token);
    if (!isAuthenticated)
        return res.status(403).json('You are not authenticated');
    return next();
});
exports.authenticationCheck = authenticationCheck;
