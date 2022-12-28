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
exports.updatePassword = exports.updateUser = exports.deleteUser = exports.getUser = exports.createUser = exports.getAllUsers = exports.login = exports.register = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const request_1 = __importDefault(require("../models/request"));
const fetchUserId_1 = require("../utils/fetchUserId");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync_1 = require("../middleware/catchAsync");
const createToken = (_id) => {
    return jwt.sign({ _id }, "secret", { expiresIn: "3d" }); //! Should be placed in environment variables
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
    // Fetch user id
    const userToken = req.get("Authorization");
    const userId = (0, fetchUserId_1.fetchUserId)(userToken);
    // Save request with payload
    yield request_1.default.create({
        requestedBy: userId,
        isApproved: false,
        action: "add",
        payload: {
            name,
            email,
        },
    });
    res.status(200).json("Request has been successfully added");
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
    // Fetch user id
    const userToken = req.get("Authorization");
    const userId = (0, fetchUserId_1.fetchUserId)(userToken);
    // Save request with payload
    yield request_1.default.create({
        requestedBy: userId,
        isApproved: false,
        action: "remove",
        payload: {
            _id: new mongoose_1.default.Types.ObjectId(id),
        },
    });
    res.status(200).json("Request has been successfully added");
}));
exports.deleteUser = deleteUser;
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    if (payload.password)
        payload.password = yield bcrypt.hash(payload.password, 12);
    // Fetch user id
    const userToken = req.get("Authorization");
    const userId = (0, fetchUserId_1.fetchUserId)(userToken);
    // Save request with payload
    yield request_1.default.create({
        requestedBy: userId,
        isApproved: false,
        action: "update",
        payload: Object.assign(Object.assign({}, payload), { _id: new mongoose_1.default.Types.ObjectId(id) }),
    });
    res.status(200).json("Request has been successfully added");
}));
exports.updateUser = updateUser;
const updatePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = req.body;
    const userToken = req.get("Authorization");
    const userId = (0, fetchUserId_1.fetchUserId)(userToken);
    if (!userId || typeof userId === 'boolean')
        return res.status(500).json('Something went wrong');
    yield user_1.default.updatePassword(password, confirmPassword, userId);
    res.status(200).json('Successfully updated password!');
}));
exports.updatePassword = updatePassword;
