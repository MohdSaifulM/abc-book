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
exports.approveRequest = exports.getAllRequests = void 0;
const user_1 = __importDefault(require("../models/user"));
const request_1 = __importDefault(require("../models/request"));
const fetchUserId_1 = require("../utils/fetchUserId");
const catchAsync_1 = require("../middleware/catchAsync");
//?===========Aggregations===========
// Look up requestedBy from user collection for request aggregation
const lookupRequestedBy = {
    $lookup: {
        from: "users",
        localField: "requestedBy",
        foreignField: "_id",
        as: "requestedBy",
    },
};
// Unwind to flatten array since we're returning just one user
const unwindRequestedBy = {
    $unwind: {
        path: "$requestedBy",
        preserveNullAndEmptyArrays: true,
    },
};
// Look up approvedBy from user collection for request aggregation
const lookupApprovedBy = {
    $lookup: {
        from: "users",
        localField: "approvedBy",
        foreignField: "_id",
        as: "approvedBy",
    },
};
// Unwind to flatten array since we're returning just one user
const unwindApprovedBy = {
    $unwind: {
        path: "$approvedBy",
        preserveNullAndEmptyArrays: true,
    },
};
const getAllRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch user id
    const userToken = req.get("Authorization");
    const adminId = (0, fetchUserId_1.fetchUserId)(userToken);
    // Query to return requests that are not requested by current users
    const query = {
        $match: {
            requestedBy: {
                $ne: adminId
            }
        }
    };
    const requests = yield request_1.default.aggregate([query, lookupRequestedBy, unwindRequestedBy, lookupApprovedBy, unwindApprovedBy]);
    res.status(200).json(requests);
}));
exports.getAllRequests = getAllRequests;
const approveRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch user id
    const userToken = req.get("Authorization");
    const adminId = (0, fetchUserId_1.fetchUserId)(userToken);
    //Fetch request
    const { id } = req.params;
    const pendingRequest = yield request_1.default.findById(id);
    // If no request OR request has already been approved OR it is request by the current user return error
    if (!pendingRequest ||
        pendingRequest.isApproved ||
        pendingRequest.requestedBy.toString() === adminId.toString())
        return res.status(500).json("Something went wrong");
    // Check action and proceed accordingly
    const { payload } = pendingRequest;
    switch (pendingRequest.action) {
        case "add":
            const { name, email } = payload;
            if (!name || !email)
                return res.status(500).json("Something went wrong");
            yield user_1.default.createUser(name, email);
            break;
        case "remove":
            const { _id } = payload;
            yield user_1.default.findByIdAndDelete(_id);
            break;
        case "update":
            const userId = payload._id;
            delete payload._id;
            yield user_1.default.findByIdAndUpdate(userId, {
                $set: payload,
            }, { returnOriginal: false });
            break;
    }
    // Finally update request and send status
    yield request_1.default.findByIdAndUpdate(id, {
        approvedBy: adminId,
        isApproved: true,
    }, { returnOriginal: false });
    res.status(200).json('Successfully approved request');
}));
exports.approveRequest = approveRequest;
