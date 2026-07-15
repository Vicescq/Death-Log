const API = import.meta.env.VITE_API;

export default class Backend {
	constructor() {}

	static async checkHealth(signal?: AbortSignal) {
		return await fetch(`${API}/health`, { method: "GET", signal });
	}

	static async backup(token: string, json: unknown, signal?: AbortSignal) {
		return await fetch(`${API}/backup`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(json),
			signal,
		});
	}

	static async autoBackup(
		token: string,
		json: unknown,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/auto-backup`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(json),
			signal,
		});
	}

	static async getBackups(token: string, signal?: AbortSignal) {
		return await fetch(`${API}/backups`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}

	static async getBackupById(
		token: string,
		id: number,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/backup/${id}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}

	static async getAutoBackupById(
		token: string,
		id: number,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/auto-backup/${id}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}

	static async deleteBackupById(
		token: string,
		id: number,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/backup/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}

	static async deleteAutoBackupById(
		token: string,
		id: number,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/auto-backup/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}

	static async postGlobalStats(
		token: string,
		slice: unknown,
		signal?: AbortSignal,
	) {
		return await fetch(`${API}/global-stats`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(slice),
			signal,
		});
	}

	static async getGlobalStats(token: string, signal?: AbortSignal) {
		return await fetch(`${API}/global-stats`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
			signal,
		});
	}
}
