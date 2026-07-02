import z from "zod";

export const FollowStatusSchema = z.object({ isFollowing: z.boolean() });
