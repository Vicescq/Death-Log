import z from "zod";

export const DiscoveredUserSchema = z.object({
	username: z.string(),
	followerCount: z.number(),
	followingCount: z.number(),
	createdAt: z.string(),
});

export const DiscoveredUsersSchema = z.object({
	randomUsers: z.array(DiscoveredUserSchema),
	recentlyJoinedUsers: z.array(DiscoveredUserSchema),
	topUsers: z.array(DiscoveredUserSchema),
	searchedUsers: z.array(DiscoveredUserSchema),
	searchTotalPages: z.number(),
});

export const DiscoveredUserListSchema = z.array(DiscoveredUserSchema);

export type DiscoveredUser = z.infer<typeof DiscoveredUserSchema>;
export type DiscoveredUsers = z.infer<typeof DiscoveredUsersSchema>;
