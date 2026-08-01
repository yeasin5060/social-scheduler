import cron from "node-cron";
import { Post } from "../models/Post.model.js";
import { Account } from "../models/Accounts.model.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";

export const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduleFor: { $lte: now },
      });

      for (const post of postsToPublish) {
        try {
          const accounts = await Account.find({
            user: post.user,
            platform: { $in: post.platforms },
            status: "connected",
            zernioAccountId: { $exists: true, $ne: null },
          });

          if (accounts.length === 0) {
            console.log(`No connected Zernio accounts found for post ${post._id}`);
            post.status = "failed";
            await post.save();
            continue;
          }

          const platforms = accounts.map((acc: any) => ({
            platform: acc.platform,
            accountId: acc.zernioAccountId,
          }));

          const payload = {
            content: post.content,
            publishNow: true,
            platforms,
            ...(post.mediaUrl
              ? {
                  mediaItems: [
                    {
                      type: post.mediaType || "image",
                      url: post.mediaUrl,
                    },
                  ],
                }
              : {}),
          };

          console.log("===== ZERNIO PAYLOAD =====");
          console.log(JSON.stringify(payload, null, 2));

          const response = await zernio.posts.createPost({
            body: payload as any,
          });

          const publishedPost =
            (response.data as any)?.post || response.data;

          if (!publishedPost) {
            throw new Error("Failed to get post object from Zernio response");
          }

          console.log(
            `Zernio post created: ${publishedPost._id || publishedPost.id}`
          );

          post.status = "published";
          await post.save();

          await ActivityLog.create({
            user: post.user,
            actionType: "POST_PUBLISHED",
            description: `Published post to ${accounts
              .map((a: any) => a.platform)
              .join(", ")}`,
            relatedPost: post._id,
          });
        } catch (err: any) {
          console.error(
            `Failed to publish post ${post._id}:`,
            err?.response?.data || err?.message || err
          );

          post.status = "failed";
          await post.save();
        }
      }

      if (postsToPublish.length > 0) {
        console.log(
          `Evaluated ${postsToPublish.length} post(s) at ${now.toISOString()}`
        );
      }
    } catch (error) {
      console.error("Error in scheduler:", error);
    }
  });
};