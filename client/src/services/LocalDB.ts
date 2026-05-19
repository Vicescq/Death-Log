import { db } from "../model/LocalDBSchema";
import type { DistinctTreeNode } from "../model/tree-node-model/TreeNodeSchema";
import type { Filters, SortSettings } from "../pages/death-log/formSchemas";
import {
	constructInitPref,
	type DeathLogViewType,
} from "../pages/death-log/utils";

export type DeathLogViewPrefs<T> = Record<DeathLogViewType, T>;

export default class LocalDB {
	constructor() {}

	static async addNode(
		node: DistinctTreeNode,
		parentNode?: DistinctTreeNode,
	) {
		db.transaction("rw", db.nodes, async () => {
			await db.nodes.add({
				node_id: node.id,
				node: node,
				email: LocalDB.getUserEmail(),
				created_at: new Date().toISOString(),
				edited_at: new Date().toISOString(),
			});
			if (node.type != "game" && parentNode) {
				await db.nodes.update(parentNode.id, {
					node_id: parentNode.id,
					node: parentNode,
					edited_at: new Date().toISOString(),
					email: LocalDB.getUserEmail(),
				});
			}
		});
	}

	static async deleteNode(ids: string[], parentNode?: DistinctTreeNode) {
		db.transaction("rw", db.nodes, async () => {
			await db.nodes.bulkDelete(ids);
			if (parentNode) {
				await db.nodes.update(parentNode.id, {
					node_id: parentNode.id,
					node: parentNode,
					edited_at: new Date().toISOString(),
					email: LocalDB.getUserEmail(),
				});
			}
		});
	}

	static async updateNode(
		node: DistinctTreeNode,
		parentNode?: DistinctTreeNode,
	) {
		await db.nodes.update(node.id, {
			node_id: node.id,
			node: node,
			edited_at: new Date().toISOString(),
			email: LocalDB.getUserEmail(),
		});
	}

	static async getNodes() {
		const rows = await db.nodes
			.where("email")
			.equals(LocalDB.getUserEmail())
			.toArray();
		const nodes = rows.map((node) => {
			return node.node;
		});
		return nodes;
	}

	static incrementCRUDCounter() {
		const prev = localStorage.getItem(
			`DEATHLOG_CRUD_COUNTER-${LocalDB.getUserEmail()}`,
		);
		let current;
		if (prev) {
			current = Number(prev) + 1;
		} else {
			current = 1;
		}
		localStorage.setItem(
			`DEATHLOG_CRUD_COUNTER-${LocalDB.getUserEmail()}`,
			String(current),
		);
	}

	static getUserEmail() {
		const email = localStorage.getItem("email");
		if (email == null) {
			LocalDB.setUserEmail("__LOCAL__");
			return "__LOCAL__";
		} else {
			return email;
		}
	}

	static setUserEmail(email: string) {
		localStorage.setItem("email", email);
	}

	static async clearData() {
		await db.nodes.where("email").equals(LocalDB.getUserEmail()).delete();
	}

	static async insertData(nodes: DistinctTreeNode[]) {
		for (let node of nodes) {
			await db.nodes.add({
				node_id: node.id,
				email: LocalDB.getUserEmail(),
				node: node,
				created_at: new Date().toISOString(),
				edited_at: new Date().toISOString(),
			});
		}
	}

	static async clearAndInsertData(nodes: DistinctTreeNode[]) {
		await db.transaction("rw", db.nodes, async () => {
			await LocalDB.clearData();
			await LocalDB.insertData(nodes);
		});
	}

	static getPrefs(pref: "filters" | "sort") {
		return localStorage.getItem;
	}

	static getDLFilterPrefs(type: DeathLogViewType): Filters | null {
		const filtersSTR = localStorage.getItem(`filters`);

		if (filtersSTR == null) {
			return null;
		} else {
			const obj: DeathLogViewPrefs<Filters> = JSON.parse(filtersSTR);
			return obj[type];
		}
	}

	static setDLFilterPrefs(
		filters: Filters,
		type: DeathLogViewType,
		defaultFilters: Filters,
	) {
		const filtersSTR = localStorage.getItem(`filters`);
		if (filtersSTR == null) {
			localStorage.setItem(
				"filters",
				JSON.stringify(constructInitPref(defaultFilters)),
			);
		} else {
			const obj: DeathLogViewPrefs<Filters> = JSON.parse(filtersSTR);
			obj[type] = filters;
			localStorage.setItem("filters", JSON.stringify(obj));
		}
	}

	static getDLSortPrefs(type: DeathLogViewType): SortSettings | null {
		const sortSettingsSTR = localStorage.getItem("sort_settings");

		if (sortSettingsSTR == null) {
			return null;
		} else {
			const obj: DeathLogViewPrefs<SortSettings> =
				JSON.parse(sortSettingsSTR);
			return obj[type];
		}
	}

	static setDLSortPrefs(
		sortSettings: SortSettings,
		type: DeathLogViewType,
		defaultSortSettings: SortSettings,
	) {
		const sortSettingsSTR = localStorage.getItem("sort_settings");

		if (sortSettingsSTR == null) {
			localStorage.setItem(
				"sort_settings",
				JSON.stringify(constructInitPref(defaultSortSettings)),
			);
		} else {
			const obj: DeathLogViewPrefs<SortSettings> =
				JSON.parse(sortSettingsSTR);
			obj[type] = sortSettings;
			localStorage.setItem("sort_settings", JSON.stringify(obj));
		}
	}

	// static getDLFilterPrefs(type: DeathLogViewType): Filters | null {
	// 	const filtersSTR = localStorage.getItem(`${type}s_view_filters`);

	// 	if (filtersSTR == null) {
	// 		return null;
	// 	} else {
	// 		return JSON.parse(filtersSTR);
	// 	}
	// }

	// static setDLFilterPrefs(filters: Filters, type: DeathLogViewType) {
	// 	localStorage.setItem(`${type}s_view_filters`, JSON.stringify(filters));
	// }

	// static getDLSortPrefs(type: DeathLogViewType): SortSettings | null {
	// 	const sortSettingsSTR = localStorage.getItem(
	// 		`${type}s_view_sort_settings`,
	// 	);

	// 	if (sortSettingsSTR == null) {
	// 		return null;
	// 	} else {
	// 		return JSON.parse(sortSettingsSTR);
	// 	}
	// }

	// static setDLSortPrefs(sortSettings: SortSettings, type: DeathLogViewType) {
	// 	localStorage.setItem(
	// 		`${type}s_view_sort_settings`,
	// 		JSON.stringify(sortSettings),
	// 	);
	// }
}
