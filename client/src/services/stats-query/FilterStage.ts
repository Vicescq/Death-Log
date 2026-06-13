import { filter as deathLogFilter } from "../../pages/death-log/utils";
import type { DistinctTreeNode, Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { NodeQuery } from "./types/node-query";
import type { DeathQuery, DeathFilters } from "./types/death-query";

export function filterNodes(
	nodes: DistinctTreeNode[],
	q: NodeQuery,
	tree: Tree,
): DistinctTreeNode[] {
	const nodeIDs = nodes.map((n) => n.id);
	const filteredIDs = deathLogFilter(nodeIDs, q.filter, tree, q.searchQuery ?? "");
	return nodes.filter((n) => filteredIDs.includes(n.id));
}

// limit: positive N = keep first N (sever end), negative N = keep last N (sever beginning), undefined = keep all
export function applyLimit<T>(data: T[], limit?: number): T[] {
	if (limit === undefined) return data;
	if (limit >= 0) return data.slice(0, limit);
	return data.slice(limit);
}

export function filterDeaths(deaths: Death[], q: DeathQuery): Death[] {
	const filters = q.filter;
	const searchQuery = q.searchQuery ?? "";

	return deaths.filter((death) => {
		const relFlagBoolVals: boolean[] = [];

		for (const key in filters) {
			const filterKey = key as keyof DeathFilters;
			switch (filterKey) {
				case "timestampRel":
					relFlagBoolVals.push(
						(filters[filterKey] ?? false) && death.timestampRel,
					);
					break;
				case "unreliableTimestamp":
					relFlagBoolVals.push(
						(filters[filterKey] ?? false) && !death.timestampRel,
					);
					break;
			}
		}

		return (
			(!death.remark ||
				death.remark.toLowerCase().includes(searchQuery.toLowerCase())) &&
			(relFlagBoolVals.length === 0 || relFlagBoolVals.some((b) => b))
		);
	});
}
