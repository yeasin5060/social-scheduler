import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { Account } from "../models/Accounts.model.js";

//get accounts 
// get /api/accounts

export const getAccounts = async (req: AuthRequest , res: Response ) : Promise <void> => {
    try {
        const accounts = await Account.find({user : req.user._id});
        res.json(accounts)
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}

//get accounts 
// post /api/accounts

export const addAccount = async (req: AuthRequest , res: Response ) : Promise <void> => {
    try {
        const {platform, handle, avatarUrl} = req.body;
        const account = await Account.create({user : req.user._id , platform, handle, avatarUrl});
        res.status(201).json(account)
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}