import { filter as deathLogFilter } from "../../pages/death-log/utils";
import type { DistinctTreeNode, Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { NodeQuery } from "../../model/stats-query-model/node-query";
import type { DeathQuery, DeathFilters } from "../../model/stats-query-model/death-query";
import type { QueryLimit } from "../../model/stats-query-model/limit";

export function filterNodes(
	nodes: DistinctTreeNode[],
	q: NodeQuery,
	tree: Tree,
): DistinctTreeNode[] {
	const nodeIDs = nodes.map((n) => n.id);
	const filteredIDs = deathLogFilter(nodeIDs, q.filter, tree, q.searchQuery ?? "");
	return nodes.filter((n) => filteredIDs.includes(n.id));
}

export function applyLimit<T>(data: T[], limit?: QueryLimit): T[] {
	if (limit === undefined) return data;
	return limit.dir === "start" ? data.slice(0, limit.count) : data.slice(-limit.count);
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
