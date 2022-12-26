import { model, Schema } from 'mongoose';
import { UserType, UserModel } from '../types/userTypes';
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
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

userSchema.statics.register = async function( name: string, email: string, password: string, confirmPassword: string) {
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

    const exists = await this.findOne({ email });

    if(exists) {
        throw Error('email already taken');
    }

    const date_joined = new Date();
    
    const hash = await bcrypt.hash(password, 12);
    const user = await this.create({ name, email, password: hash, date_joined });

    return user;
}

userSchema.statics.createUser = async function( name: string, email: string) {
    if (!name || !email) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }

    const exists = await this.findOne({ email });

    if(exists) {
        throw Error('email already taken');
    }

    const date_joined = new Date();

    const defaultPass = 'Pass@123';
    
    const hash = await bcrypt.hash(defaultPass, 12);
    const user = await this.create({ name, email, password: hash, date_joined });

    return user;
}

userSchema.statics.login = async function(email: string, password: string) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    const user = await this.findOne({ email });
    
    if (!user) {
        throw Error('Incorrect email');
    }
    
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw Error('Incorrect password');
    }

    return user;
}



export default model<UserType, UserModel>('User', userSchema);



