const API = import.meta.env.VITE_API;

export default class Backend {
	constructor() {}

	static async checkHealth(signal?: AbortSignal) {
		return await fetch(`${API}/health`, { method: "GET", signal });
	}
}
