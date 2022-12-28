import { Document, Types } from 'mongoose';

enum Action {
    add = 'add',
    remove = 'remove',
    update = 'update'
};

type Payload = {
    _id?: Types.ObjectId,
    name?: string,
    email?: string,
    role?: string,
    password?: string
}

export interface RequestType extends Document {
    requestedBy: Types.ObjectId,
    isApproved: boolean,
    approvedBy: Types.ObjectId,
    action: Action,
    payload: Payload
}