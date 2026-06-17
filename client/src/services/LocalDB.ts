import { db } from "../model/LocalDBSchema";
import type { DistinctTreeNode } from "../model/tree-node-model/TreeNodeSchema";
import { DistinctTreeNodeShapeSchema } from "../model/tree-node-model/DistinctTreeNodeShapeSchema";
import { assertIsDistinctTreeNode } from "../utils/asserts";
import { StatsViewSchema, type StatsView } from "../model/StatsViewSchema";
import {
	FiltersSchema,
	SortSchema,
	type Filters,
	type SortSettings,
} from "../model/formSchemas";
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
		const email = LocalDB.getUserEmail();
		return db.transaction("rw", db.nodes, async () => {
			await db.nodes.add({
				node_id: node.id,
				node: node,
				email: email,
				created_at: new Date().toISOString(),
				edited_at: new Date().toISOString(),
			});
			if (node.type != "game" && parentNode) {
				// email omitted: .update is a partial merge, so the existing
				// partition key is preserved (an edit never changes ownership)
				await db.nodes.update(parentNode.id, {
					node_id: parentNode.id,
					node: parentNode,
					edited_at: new Date().toISOString(),
				});
			}
		});
	}

	static async deleteNode(ids: string[], parentNode?: DistinctTreeNode) {
		return db.transaction("rw", db.nodes, async () => {
			await db.nodes.bulkDelete(ids);
			if (parentNode) {
				// email omitted: see addNode — preserves the existing partition key
				await db.nodes.update(parentNode.id, {
					node_id: parentNode.id,
					node: parentNode,
					edited_at: new Date().toISOString(),
				});
			}
		});
	}

	static async updateNode(node: DistinctTreeNode) {
		// email omitted: see addNode — preserves the existing partition key
		await db.nodes.update(node.id, {
			node_id: node.id,
			node: node,
			edited_at: new Date().toISOString(),
		});
	}

	static async getNodes(email: string = LocalDB.getUserEmail()) {
		const rows = await db.nodes.where("email").equals(email).toArray();
		return rows.map((row) => {
			const result = DistinctTreeNodeShapeSchema.safeParse(row.node);
			if (!result.success) {
				console.error(
					`[LocalDB] Failed to parse node ${row.node_id}:`,
					result.error,
				);
				throw new Error(
					`Failed to load node "${row.node_id}". Your local data may be corrupted or out of date. Visit Data Management to reset your local data.`,
				);
			}
			assertIsDistinctTreeNode(result.data);
			return result.data;
		});
	}

	static async getViews() {
		const rows = await db.views
			.where("email")
			.equals(LocalDB.getUserEmail())
			.toArray();
		return rows.map((row) => {
			const result = StatsViewSchema.safeParse(row.view);
			if (!result.success) {
				console.error(
					`[LocalDB] Failed to parse view ${row.view_id}:`,
					result.error,
				);
				throw new Error(
					`Failed to load view "${row.view_id}". Your local data may be corrupted or out of date. Visit Data Management to reset your local data.`,
				);
			}
			return result.data;
		});
	}

	static async addView(view: StatsView) {
		if (view.source != "custom") {
			throw new Error("Cannot persist a default StatsView.");
		}
		await db.views.add({
			view_id: view.id,
			view: view,
			email: LocalDB.getUserEmail(),
			created_at: new Date().toISOString(),
			edited_at: new Date().toISOString(),
		});
	}

	static async updateView(view: StatsView) {
		if (view.source != "custom") {
			throw new Error("Cannot persist a default StatsView.");
		}
		await db.views.update(view.id, {
			view_id: view.id,
			view: view,
			edited_at: new Date().toISOString(),
			email: LocalDB.getUserEmail(),
		});
	}

	static async deleteView(id: string) {
		await db.views.delete(id);
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

	/** Read-only variant of getUserEmail — no `__LOCAL__` write-fallback, safe to call during render. */
	static peekUserEmail() {
		return localStorage.getItem("email") ?? "__LOCAL__";
	}

	static setUserEmail(email: string) {
		localStorage.setItem("email", email);
	}

	static async clearData(email: string) {
		await db.nodes.where("email").equals(email).delete();
		await db.views.where("email").equals(email).delete();
	}

	static async insertData(nodes: DistinctTreeNode[], email: string) {
		for (let node of nodes) {
			await db.nodes.add({
				node_id: node.id,
				email: email,
				node: node,
				created_at: new Date().toISOString(),
				edited_at: new Date().toISOString(),
			});
		}
	}

	static async clearAndInsertData(nodes: DistinctTreeNode[]) {
		const email = LocalDB.getUserEmail();
		await db.transaction("rw", db.nodes, db.views, async () => {
			await LocalDB.clearData(email);
			await LocalDB.insertData(nodes, email);
		});
	}

	static getDLFilterPrefs(
		type: DeathLogViewType,
		defaultFilters: Filters,
	): Filters {
		const filtersSTR = localStorage.getItem(
			`filters-${LocalDB.getUserEmail()}`,
		);
		if (filtersSTR == null) return defaultFilters;
		try {
			const obj = JSON.parse(filtersSTR);
			const result = FiltersSchema.safeParse(obj[type]);
			return result.success ? result.data : defaultFilters;
		} catch {
			return defaultFilters;
		}
	}

	static setDLFilterPrefs(
		filters: Filters,
		type: DeathLogViewType,
		defaultFilters: Filters,
	) {
		const key = `filters-${LocalDB.getUserEmail()}`;
		const filtersSTR = localStorage.getItem(key);
		if (filtersSTR == null) {
			localStorage.setItem(
				key,
				JSON.stringify(constructInitPref(defaultFilters)),
			);
		} else {
			try {
				const obj: DeathLogViewPrefs<Filters> = JSON.parse(filtersSTR);
				obj[type] = filters;
				localStorage.setItem(key, JSON.stringify(obj));
			} catch {
				localStorage.setItem(
					key,
					JSON.stringify(constructInitPref(defaultFilters)),
				);
			}
		}
	}

	static getDLSortPrefs(
		type: DeathLogViewType,
		defaultSortSettings: SortSettings,
	): SortSettings {
		const sortSettingsSTR = localStorage.getItem(
			`sort_settings-${LocalDB.getUserEmail()}`,
		);
		if (sortSettingsSTR == null) return defaultSortSettings;
		try {
			const obj = JSON.parse(sortSettingsSTR);
			const result = SortSchema.safeParse(obj[type]);
			return result.success ? result.data : defaultSortSettings;
		} catch {
			return defaultSortSettings;
		}
	}

	static setDLSortPrefs(
		sortSettings: SortSettings,
		type: DeathLogViewType,
		defaultSortSettings: SortSettings,
	) {
		const key = `sort_settings-${LocalDB.getUserEmail()}`;
		const sortSettingsSTR = localStorage.getItem(key);
		if (sortSettingsSTR == null) {
			localStorage.setItem(
				key,
				JSON.stringify(constructInitPref(defaultSortSettings)),
			);
		} else {
			try {
				const obj: DeathLogViewPrefs<SortSettings> =
					JSON.parse(sortSettingsSTR);
				obj[type] = sortSettings;
				localStorage.setItem(key, JSON.stringify(obj));
			} catch {
				localStorage.setItem(
					key,
					JSON.stringify(constructInitPref(defaultSortSettings)),
				);
			}
		}
	}
}
