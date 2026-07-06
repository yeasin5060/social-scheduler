import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { Account } from "../models/Accounts.model.js";
import zernio from "../config/zernio.js";

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

//post accounts 
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

//dicconnected accounts 
// delete /api/accounts

export const disconnectedAccount = async (req: AuthRequest , res: Response ) : Promise <void> => {
    try {
        const account = await Account.findOne({ _id : req.params.id , user : req.user._id ,});
        if(!account){
            res.status(404).json({message : "Account not found"});
            return;
        }
        if(account.zernioAccountId){
            try {
                await zernio.accounts.deleteAccount({path : {accountId : account.zernioAccountId}})
            } catch (error : any) {
                res.status(500).json({ message : error?.response?.data?.message || error?.message});
            }
        }

        await account.deleteOne()
        res.json({message : "Account disconneted successfully"})
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}