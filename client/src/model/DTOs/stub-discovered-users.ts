import type { DiscoveredUser } from "./discovered-users";

// dev only
export function buildStubUser(seed: string, n: number): DiscoveredUser {
	return {
		username: `${seed}_${n}`,
		followerCount: n * 3,
		followingCount: n * 2,
		createdAt: new Date(2024, 0, (n % 28) + 1).toISOString(),
	};
}

export function buildStubUsers(seed: string, count: number): DiscoveredUser[] {
	return Array.from({ length: count }, (_, i) => buildStubUser(seed, i + 1));
}
