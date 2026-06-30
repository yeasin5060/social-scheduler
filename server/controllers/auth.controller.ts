import { Request, Response } from "express";
import { User } from "../models/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register user
//Post /api/auth/register

const generatedToken = (id:string) => {
    return jwt.sign({id}, process.env.JWT_SECRET || 'fallback_secret',{expiresIn : '30d'});
}

export const registerUser = async (req : Request , res : Response) : Promise<void> => {
    try {
        const {email , password , name} = req.body;
        // Validate required fields
        if (![name, email, password].every((field) => field && field.trim())) {
            res.status(400).json({ message : "All fields are required" });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});

        if (existingUser) {
            res.status(400).json({ message : "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password , salt);

        const user = await User.create({name , email , password : hashPassword});

        if(user){
            res.status(201).json({_id : user._id, name : user.name, email : user.email, token : generatedToken(user._id.toString()) });
        }else {
            res.status(400).json({ message : "Invalid user data" });
        }
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}
