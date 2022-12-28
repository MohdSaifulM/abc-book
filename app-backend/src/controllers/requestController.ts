import { Response, Request } from "express";
import { RequestType } from "../types/requestTypes";
import User from "../models/user";
import request from "../models/request";
import { fetchUserId } from "../utils/fetchUserId";
import { catchAsync } from "../middleware/catchAsync";

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

const getAllRequests = catchAsync(async (req: Request, res: Response) => {
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const adminId = fetchUserId(userToken);
    // Query to return requests that are not requested by current users
    const query = {
        $match: {
            requestedBy: {
                $ne: adminId
            }
        }
    }
    
    const requests: RequestType[] = await request.aggregate([query, lookupRequestedBy, unwindRequestedBy, lookupApprovedBy, unwindApprovedBy]);
    res.status(200).json(requests);
});

const approveRequest = catchAsync(async (req: Request, res: Response) => {
    // Fetch user id
    const userToken: string | undefined = req.get("Authorization");
    const adminId = fetchUserId(userToken);
    //Fetch request
    const { id } = req.params;
    const pendingRequest = await request.findById(id);
    // If no request OR request has already been approved OR it is request by the current user return error
    if (
        !pendingRequest ||
        pendingRequest.isApproved ||
        pendingRequest.requestedBy.toString() === adminId.toString()
    )
        return res.status(500).json("Something went wrong");
    // Check action and proceed accordingly
    const { payload } = pendingRequest;
    switch (pendingRequest.action) {
        case "add":
            const { name, email } = payload;
            if (!name || !email) return res.status(500).json("Something went wrong");
            await User.createUser(name, email);
            break;
        case "remove":
            const { _id } = payload;
            await User.findByIdAndDelete(_id);
            break;
        case "update":
            const userId = payload._id;
            delete payload._id;
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: payload,
                },
                { returnOriginal: false }
            );
            break;
    }
    // Finally update request and send status
    await request.findByIdAndUpdate(
        id,
        {
            approvedBy: adminId,
            isApproved: true,
        },
        { returnOriginal: false }
    );
    res.status(200).json('Successfully approved request');
});

export { getAllRequests, approveRequest };
