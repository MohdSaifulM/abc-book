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
exports.updateUser = exports.deleteUser = exports.getUser = exports.createUser = exports.getAllUsers = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync_1 = require("../middleware/catchAsync");
const createToken = (_id) => {
    return jwt.sign({ _id }, 'secret', { expiresIn: '3d' }); //! Should be placed in environment variables
};
const login = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ user, token });
}));
exports.login = login;
const register = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmPassword } = req.body;
    const user = yield user_1.default.register(name, email, password, confirmPassword);
    const token = createToken(user._id);
    res.status(200).json({ user, token });
}));
exports.register = register;
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const user = yield user_1.default.createUser(name, email);
    res.status(200).json({ user });
}));
exports.createUser = createUser;
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    res.status(200).json(users);
}));
exports.getAllUsers = getAllUsers;
const getUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findById(id);
    res.status(200).json(user);
}));
exports.getUser = getUser;
const deleteUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_1.default.findByIdAndDelete(id);
    res.status(200).json(`Successfully deleted user :: ${id}`);
}));
exports.deleteUser = deleteUser;
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    if (payload.password)
        payload.password = yield bcrypt.hash(payload.password, 12);
    const updatedUser = yield user_1.default.findByIdAndUpdate(id, {
        $set: payload
    });
    res.status(200).json(updatedUser);
}));
exports.updateUser = updateUser;
