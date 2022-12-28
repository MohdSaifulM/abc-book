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
const mongoose_1 = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'user'],
        default: 'user',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_joined: {
        type: Date,
        required: true
    }
});
//?===========User Static Methods===========
userSchema.statics.register = function (name, email, password, confirmPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name || !email || !password || !confirmPassword) {
            throw Error('All fields must be filled');
        }
        if (!validator.isEmail(email)) {
            throw Error('Email is not valid');
        }
        if (password !== confirmPassword) {
            throw Error('Passwords do not match');
        }
        if (!validator.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
        const exists = yield this.findOne({ email });
        if (exists) {
            throw Error('email already taken');
        }
        const date_joined = new Date();
        const hash = yield bcrypt.hash(password, 12);
        const user = yield this.create({ name, email, password: hash, date_joined });
        return user;
    });
};
userSchema.statics.createUser = function (name, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name || !email) {
            throw Error('All fields must be filled');
        }
        if (!validator.isEmail(email)) {
            throw Error('Email is not valid');
        }
        const exists = yield this.findOne({ email });
        if (exists) {
            throw Error('email already taken');
        }
        const date_joined = new Date();
        const defaultPass = 'Pass@123';
        const hash = yield bcrypt.hash(defaultPass, 12);
        const user = yield this.create({ name, email, password: hash, date_joined });
        return user;
    });
};
userSchema.statics.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password) {
            throw Error('All fields must be filled');
        }
        const user = yield this.findOne({ email });
        if (!user) {
            throw Error('Incorrect email');
        }
        const isValid = yield bcrypt.compare(password, user.password);
        if (!isValid) {
            throw Error('Incorrect password');
        }
        return user;
    });
};
userSchema.statics.updatePassword = function (password, confirmPassword, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!confirmPassword || !password) {
            throw Error('All fields must be filled');
        }
        if (password !== confirmPassword) {
            throw Error('Passwords must match!');
        }
        if (!validator.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
        const hash = yield bcrypt.hash(password, 12);
        const user = yield this.findByIdAndUpdate(userId, { password: hash });
        return user;
    });
};
exports.default = (0, mongoose_1.model)('User', userSchema);
