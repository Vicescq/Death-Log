import z from "zod";
import { db } from "../model/LocalDBSchema";
import type { DistinctTreeNode } from "../model/tree-node-model/TreeNodeSchema";
import { DistinctTreeNodeShapeSchema } from "../model/tree-node-model/DistinctTreeNodeShapeSchema";
import { assertIsDistinctTreeNode } from "../utils/asserts";
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
import {
	CrudStateSchema,
	DEFAULT_CRUD_STATE,
	type CrudState,
} from "../model/CrudStateSchema";

export type DeathLogViewPrefs<T> = Record<DeathLogViewType, T>;

export type StorageEstimateInfo = {
	usageBytes: number;
	quotaBytes: number;
	percentage: number;
};

const ChartOverrideSchema = z.object({
	showUnreliable: z.boolean().optional(),
});

const ChartOverrideMapSchema = z.record(z.string(), ChartOverrideSchema);

export type ChartOverride = z.infer<typeof ChartOverrideSchema>;

type ChartOverrideMap = z.infer<typeof ChartOverrideMapSchema>;

const FILTER_PREF_KEY = "filters";
const SORT_PREF_KEY = "sort-settings";
const CHART_OVERRIDES_KEY = "chart-overrides";
const CRUD_STATE_KEY = "crud-state";

export default class LocalDB {
	constructor() {}

	static async addNode(
		node: DistinctTreeNode,
		parentNode?: DistinctTreeNode,
	) {
		return db.transaction("rw", db.nodes, async () => {
			await db.nodes.add({
				node_id: node.id,
				node: node,
				created_at: new Date().toISOString(),
				edited_at: new Date().toISOString(),
			});
			if (node.type != "game" && parentNode) {
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
				await db.nodes.update(parentNode.id, {
					node_id: parentNode.id,
					node: parentNode,
					edited_at: new Date().toISOString(),
				});
			}
		});
	}

	static async updateNode(node: DistinctTreeNode) {
		await db.nodes.update(node.id, {
			node_id: node.id,
			node: node,
			edited_at: new Date().toISOString(),
		});
	}

	static async getNodes() {
		const rows = await db.nodes.toArray();
		return rows.map((row) => {
			const result = DistinctTreeNodeShapeSchema.safeParse(row.node);
			if (!result.success) {
				console.error(
					`[LocalDB] Failed to parse node ${row.node_id}:`,
					result.error,
				);
				throw new Error(
					`Failed to load node "${row.node_id}". Your local data may be corrupted or out of date. Visit Data Management and use Delete Local Data to reset it.`,
				);
			}
			assertIsDistinctTreeNode(result.data);
			return result.data;
		});
	}

	static getCrudState(): CrudState {
		const raw = localStorage.getItem(CRUD_STATE_KEY);
		if (!raw) return DEFAULT_CRUD_STATE;
		try {
			const result = CrudStateSchema.safeParse(JSON.parse(raw));
			if (result.success) return result.data;
		} catch {
			// fall through to reset below
		}
		localStorage.setItem(
			CRUD_STATE_KEY,
			JSON.stringify(DEFAULT_CRUD_STATE),
		);
		return DEFAULT_CRUD_STATE;
	}

	private static writeCrudState(patch: Partial<CrudState>) {
		const merged = { ...LocalDB.getCrudState(), ...patch };
		localStorage.setItem(CRUD_STATE_KEY, JSON.stringify(merged));
	}

	static incrementCRUDCounter() {
		LocalDB.writeCrudState({ count: LocalDB.getCrudState().count + 1 });
	}

	static resetCRUDCounter() {
		LocalDB.writeCrudState({ count: 0 });
	}

	static resetCrudState(lastBackup: number) {
		LocalDB.writeCrudState({ count: 0, lastBackup });
	}

	static setAutoBackup(autoBackup: boolean) {
		LocalDB.writeCrudState({ autoBackup });
	}

	static async clearAndInsertData(nodes: DistinctTreeNode[]) {
		await db.transaction("rw", db.nodes, async () => {
			await db.nodes.clear();
			for (let node of nodes) {
				await db.nodes.add({
					node_id: node.id,
					node: node,
					created_at: new Date().toISOString(),
					edited_at: new Date().toISOString(),
				});
			}
		});
	}

	static getDLFilterPrefs(
		type: DeathLogViewType,
		defaultFilters: Filters,
	): Filters {
		const filtersSTR = localStorage.getItem(FILTER_PREF_KEY);
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
		const filtersSTR = localStorage.getItem(FILTER_PREF_KEY);
		if (filtersSTR == null) {
			localStorage.setItem(
				FILTER_PREF_KEY,
				JSON.stringify(constructInitPref(defaultFilters)),
			);
		} else {
			try {
				const obj: DeathLogViewPrefs<Filters> = JSON.parse(filtersSTR);
				obj[type] = filters;
				localStorage.setItem(FILTER_PREF_KEY, JSON.stringify(obj));
			} catch {
				localStorage.setItem(
					FILTER_PREF_KEY,
					JSON.stringify(constructInitPref(defaultFilters)),
				);
			}
		}
	}

	static getDLSortPrefs(
		type: DeathLogViewType,
		defaultSortSettings: SortSettings,
	): SortSettings {
		const sortSettingsSTR = localStorage.getItem(SORT_PREF_KEY);
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
		const sortSettingsSTR = localStorage.getItem(SORT_PREF_KEY);
		if (sortSettingsSTR == null) {
			localStorage.setItem(
				SORT_PREF_KEY,
				JSON.stringify(constructInitPref(defaultSortSettings)),
			);
		} else {
			try {
				const obj: DeathLogViewPrefs<SortSettings> =
					JSON.parse(sortSettingsSTR);
				obj[type] = sortSettings;
				localStorage.setItem(SORT_PREF_KEY, JSON.stringify(obj));
			} catch {
				localStorage.setItem(
					SORT_PREF_KEY,
					JSON.stringify(constructInitPref(defaultSortSettings)),
				);
			}
		}
	}

	private static readChartOverrides(): ChartOverrideMap {
		const raw = localStorage.getItem(CHART_OVERRIDES_KEY);
		if (!raw) return {};
		try {
			const result = ChartOverrideMapSchema.safeParse(JSON.parse(raw));
			return result.success ? result.data : {};
		} catch {
			return {};
		}
	}

	static getChartOverride(id: string): ChartOverride {
		return LocalDB.readChartOverrides()[id] ?? {};
	}

	static setChartOverride(id: string, patch: ChartOverride) {
		const map = LocalDB.readChartOverrides();
		map[id] = { ...map[id], ...patch };
		localStorage.setItem(CHART_OVERRIDES_KEY, JSON.stringify(map));
	}

	static dbVersion(): number {
		return db.verno;
	}

	static async showEstimatedQuota(): Promise<StorageEstimateInfo | null> {
		if (navigator.storage && navigator.storage.estimate) {
			const estimation = await navigator.storage.estimate();

			if (
				estimation.quota != undefined &&
				estimation.usage != undefined
			) {
				return {
					usageBytes: estimation.usage,
					quotaBytes: estimation.quota,
					percentage:
						estimation.quota === 0
							? 0
							: (estimation.usage / estimation.quota) * 100,
				};
			} else {
				console.error(
					"StorageManager found but estimation.quota and estimation.usage not found",
				);
				return null;
			}
		} else {
			console.error("StorageManager not found");
			return null;
		}
	}

	static async clearLocalData() {
		const prefixes = [
			FILTER_PREF_KEY,
			SORT_PREF_KEY,
			CHART_OVERRIDES_KEY,
			CRUD_STATE_KEY,
		];
		for (const key of Object.keys(localStorage)) {
			if (prefixes.some((prefix) => key.startsWith(prefix))) {
				localStorage.removeItem(key);
			}
		}
		await db.delete();
		await db.open();

		await LocalDB.clearCache(); // hides the successful toast that pops due to force reload
	}

	static async clearCache() {
		if (navigator.serviceWorker) {
			const registrations =
				await navigator.serviceWorker.getRegistrations();
			for (let i = 0; i < registrations.length; i++) {
				const didUnregister = await registrations[i].unregister();
				if (didUnregister) {
					console.log("Unregistered Service Worker!");
				} else {
					console.error("Service Worker failed to unregister!");
				}
			}
		} else {
			console.error("Cannot find a ServiceWorker!");
		}

		const cacheKeys = await caches.keys();
		for (let i = 0; i < cacheKeys.length; i++) {
			const didDelete = await caches.delete(cacheKeys[i]);
			if (didDelete) {
				console.log(`Deleted cache store: ${cacheKeys[i]}`);
			} else {
				console.error(`Could not delete cache store: ${cacheKeys[i]}`);
			}
		}

		location.reload();
	}
}
