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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorAuthorizationCheck = exports.adminAuthorizationCheck = void 0;
const user_1 = __importDefault(require("./../models/user"));
const jwt = require('jsonwebtoken');
const checkIfAuthorized = (token, allowEditor) => __awaiter(void 0, void 0, void 0, function* () {
    // Return false if no token
    if (!token)
        return false;
    // Split bearer token to 'Bearer' string and token
    const tokenArray = token.split(" ");
    // Decode token and return user id
    const userId = jwt.decode(tokenArray[1]);
    // Find user from db
    const user = yield user_1.default.findById(userId);
    // If not found return false
    if (!user)
        return false;
    // Return false if user role is not authorized
    return allowEditor ? ['admin', 'editor'].includes(user.role) : user.role === 'admin';
});
// Check if current user is authorized to make request
const adminAuthorizationCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get('Authorization');
    const isAuthenticated = yield checkIfAuthorized(token, false);
    if (!isAuthenticated)
        return res.status(403).json('You are not authorized');
    return next();
});
exports.adminAuthorizationCheck = adminAuthorizationCheck;
const editorAuthorizationCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get('Authorization');
    const isAuthenticated = yield checkIfAuthorized(token, true);
    if (!isAuthenticated)
        return res.status(403).json('You are not authorized');
    return next();
});
exports.editorAuthorizationCheck = editorAuthorizationCheck;
