import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { ActivityLog } from "../models/ActivityLog.js";

//Get All Activity
// Get /api/activity
export const getActivity = async (req : AuthRequest, res : Response ): Promise<void> => {
    try {
        const activity = await ActivityLog.find({user : req.user._id}).sort({createdAt : -1}).limit(10).populate('relatedPost' , 'content');
        res.status(201).json(activity);
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}