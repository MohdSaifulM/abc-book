import { Model, Document } from 'mongoose';

enum Roles {
    admin = 'admin',
    editor = 'editor',
    user = 'user'
}

export interface UserType extends Document {
    name: string,
    email: string,
    role: Roles,
    password: string,
    date_joined: string
}

export interface UserModel extends Model<UserType> {
    register(name: string, email: string, password: string, confirmPassword: string): UserType,
    login(email: string, password: string): UserType,
    createUser(name: string, email: string): UserType
}