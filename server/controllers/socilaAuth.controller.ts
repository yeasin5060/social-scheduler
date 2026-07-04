import { Request, Response } from "express";
import zernio from "../config/zernio.js";
import { User } from "../models/User.model.js";
import { Account } from "../models/Accounts.model.js";

//

const getOrCreateZernioPrifile = async (user : any) : Promise <string> => {
    try {
        const result = await zernio.profiles.listProfiles();
        const data = result.data as any;
        const profiles : any[] = Array.isArray(data) ? data : data.profiles || data?.data || [] ;

        if(profiles.length > 0){
            const pid = profiles[0]._id || profiles[0].id;
            await User.findByIdAndUpdate(user._id , {zernioProfileId : pid});
            return pid;
        }

        const createResult = await zernio.profiles.createProfile({
            body : {name : `${user.name || user.email}' s workspace`} as any,
        });
        const create = (createResult.data as any) ?.profiles || createResult.data;
        const pid = create?._id || create?.id;

        if(!pid){
            throw new Error('Failed to create nernio profile -no ID returned');
        }

        await User.findByIdAndUpdate(user._id , {zernioProfileId : pid});
        return pid;
    } catch (error : any) {
        console.log('getOrCreateZernioPrifile Error', error?.message || error);
        throw error;
    }
}

// Generate Auth authentication Url
//Get /api/auth/platform


export const generateAuthUrl = async (req: Request , res: Response) : Promise <void> => {
    try {
        const {platform} = req.params;
        const profileId = await getOrCreateZernioPrifile(req.user);

        const orgin = req.headers.origin;
        const redirectUrl = `${orgin}/accounts`;

        const result = await zernio.connect.getConnectUrl({
            path : {platform : platform as any},
            query : {
                profileId,
                redirect_url : redirectUrl
            }
        });

        const data = result.data as any;

        console.log("getConnectUrl response:", JSON.stringify(data, null, 2));

        const authUrl = data.authUrl;

        if(!authUrl){
            throw new Error (`Zernio returned no authUrl.Full response: ${JSON.stringify(data)}`);
        }

        res.json({url:authUrl})
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}

//sync connected account from zernio into mongodb
//get /api/auth/sync

export const syncAccounts = async (req: Request , res: Response): Promise<void> => {
    try {
        const profileId = await getOrCreateZernioPrifile(req.user);
        const result = await zernio.accounts.listAccounts({
            query : {profileId} as any
        });

        const data = result.data as any;
        const zernioAccounts : any[] = data?.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatfroms = ["twitter","linkedin","fecebook","instagram"];
        const syncedAccounts = [];
        for(const zAccount of zernioAccounts){
            const zId = zAccount._id || zAccount.id

            if(!zId) {
                console.warn('Skipping account with no ID:', zAccount);
                continue;
            }

            const rawPlatform = (zAccount.platform || zAccount.type || '').toLowerCase();
            const normalizedPlatform = supportedPlatfroms.find((p)=> rawPlatform.includes(p));

            if(!normalizedPlatform){
                console.log(`Skipping unsupporting platform : "${rawPlatform}"`);
                continue;
            }

            const account = await Account.findOneAndUpdate(
                {zernioAccountId : zId},
                {
                   user : req.user._id,
                   platform : normalizedPlatform,
                   handle : zAccount.username || zAccount.name || zAccount.handle || "Unknown" ,
                   zernioAccountId : zId,
                   status : "connected",
                   avatarUrl : zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url
                }, 
                {
                    upsert : true , returnDocument : "after"
                }
            )
            syncedAccounts.push(account);
        }
        res.json(syncedAccounts);
    } catch (error : any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
}