import type { SharedProfile } from "../model/stats-query-model/shared-charts";

const API = import.meta.env.VITE_API;

export default class Backend {
	constructor() {}

	static async checkHealth(signal?: AbortSignal) {
		return await fetch(`${API}/health`, { method: "GET", signal });
	}

	static async shareProfile(
		token: string,
		username: string,
		sharedProfile: SharedProfile,
	) {
		return await fetch(`${API}/profiles/${username}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(sharedProfile),
		});
	}

	static async visitProfile(username: string, signal?: AbortSignal) {
		return await fetch(`${API}/profiles/${username}`, {
			method: "GET",
			signal,
		});
	}

	static async unshareProfile(token: string, username: string) {
		return await fetch(`${API}/profiles/${username}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	static async getFollowers(username: string, signal?: AbortSignal) {
		return await fetch(`${API}/followers/${username}`, {
			method: "GET",
			signal,
		});
	}

	static async getFollowing(username: string, signal?: AbortSignal) {
		return await fetch(`${API}/following/${username}`, {
			method: "GET",
			signal,
		});
	}

	static async getFollowStatus(
		token: string,
		username: string,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/follows/${username}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}

	static async follow(token: string, username: string) {
		return await fetch(`${API}/follows/${username}`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	static async unfollow(token: string, username: string) {
		return await fetch(`${API}/follows/${username}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	static async browseProfiles(exclude?: string, signal?: AbortSignal) {
		const params = new URLSearchParams();
		if (exclude) params.set("exclude", exclude);
		const query = params.toString();
		return await fetch(`${API}/users${query ? `?${query}` : ""}`, {
			method: "GET",
			signal,
		});
	}
}
