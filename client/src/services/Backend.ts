import type { SharedProfile } from "../model/stats-query-model/shared-charts";

const API = import.meta.env.VITE_API;

export default class Backend {
	constructor() {}

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

	static async visitProfile(token: string, username: string) {
		return await fetch(`${API}/profiles/${username}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	static async browseProfiles() {
		return await fetch(`${API}/users`, {
			method: "GET",
		});
	}
}
