import z from "zod";

export const DiscoveredUserSchema = z.object({
	username: z.string(),
	followerCount: z.number(),
	followingCount: z.number(),
	createdAt: z.string(),
});

export const DiscoveredUsersSchema = z.object({
	randomUsers: z.array(DiscoveredUserSchema),
	familiarUsers: z.array(DiscoveredUserSchema),
});

export type DiscoveredUser = z.infer<typeof DiscoveredUserSchema>;
export type DiscoveredUsers = z.infer<typeof DiscoveredUsersSchema>;
