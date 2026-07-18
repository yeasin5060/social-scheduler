import cron from 'node-cron';
import { Post } from '../models/Post.model.js';
import { Account } from '../models/Accounts.model.js';
import zernio from '../config/zernio.js';
import { ActivityLog } from '../models/ActivityLog.js';

export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
       try {
            const now = new Date();
            const postToPublished = await Post.find({status : "scheduled" , scheduleFor : {$lte : now}});

            for (const post of postToPublished) {
                try {
                    const accounts = await Account.find({
                        user : post.user,
                        platform :{$in : post.platforms},
                        status : 'connected',
                        zernioAccountId : {$exists : true}
                    });

                    if(accounts.length === 0){
                        console.log(`No connected nernio accounts found for post ${post._id}`);
                        continue;
                    }

                    const zernioPlatforms = accounts.map((acc)=> ({
                        tform : acc.platform as any,
                        accountsId : acc.zernioAccountId!
                    }));

                    const payload = {
                        content : post.content,
                        publishNow : true,
                        ...(post.mediaUrl ? {mediaItems : [{type : post.mediaType || "image", urt : post.mediaUrl}]} : {}),
                        platforms : zernioPlatforms
                    }

                    console.log(`Publishing post ${post._id} to zernio with media : ${post.mediaUrl || 'none'}`);

                    const response = await zernio.posts.createPost({
                        body : payload
                    });

                    const publishedPost = (response.data as any)?.post || response.data;

                    if(publishedPost){
                        throw new Error('Failed to get post object from Zernio response')
                    }

                    console.log(`Zernio post create : ${publishedPost._id || publishedPost.id}`);

                    post.status = 'published';
                    await post.save();

                    await ActivityLog.create({
                        user : post.user,
                        actionType : 'POST_PUBLISHED',
                        description : `Published post to ${accounts.map((a)=> a.platform).join(', ')}`,
                        relatedPost : post._id
                    });
                } catch (err:any) {
                    console.log(`Failed to publish post ${post._id}:`,err?.respone?.data || err.message);
                    post.status = 'failed';
                    await post.save();
                }
            }
            if(postToPublished.length > 0){
                console.log(`Evaluated ${postToPublished.length} post at ${now.toISOString()}`);
            }
       } catch (error) {
            console.error ('Error in scheduler:', error);
       }
    });
}