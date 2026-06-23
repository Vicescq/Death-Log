import type { SharedProfile } from "../model/stats-query-model/shared-charts";

const API = import.meta.env.DEV
	? import.meta.env.VITE_DEV_API
	: import.meta.env.VITE_PROD_API;

const data: SharedProfile = {
	chartSlots: [
		{
			id: "slot-001",
			tab: "overview",
			spec: {
				type: "bar",
				title: "Monthly Category Distribution",
				data: {
					category: [
						{ x: "Electronics", y: 1500 },
						{ x: "Apparel", y: 850 },
					],
				},
			},
		},
		{
			id: "slot-002",
			tab: "specialized",
			spec: {
				type: "sunburst",
				title: "Hierarchical Market Share",
				data: {
					sunburst: [
						{
							name: "North America",
							value: 500,
							children: [
								{ name: "USA", value: 350, children: [] },
								{ name: "Canada", value: 150, children: [] },
							],
						},
					],
					// category: [
					// 	{ x: "Electronics", y: 1500 },
					// 	{ x: "Apparel", y: 850 },
					// ],
				},
			},
		},
	],
};

export default class Backend {
	constructor() {}

	static async shareProfile(token: string) {
		const res = await fetch(`${API}/profile`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(res.status);
	}

	static async testEndpoint() {
		const res = await fetch(API, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		console.log(await res.text());
	}

	static async abc(token: string) {
		const res = await fetch(API, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(res.status);
	}
}
