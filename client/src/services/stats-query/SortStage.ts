import { sort as deathLogSort } from "../../pages/death-log/utils";
import type { DistinctTreeNode, Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { NodeQuery } from "../../model/stats-query-model/node-query";
import type { DeathQuery } from "../../model/stats-query-model/death-query";

export function sortNodes(
	nodes: DistinctTreeNode[],
	q: NodeQuery,
	tree: Tree,
): DistinctTreeNode[] {
	const nodeIDs = nodes.map((n) => n.id);
	const sortedIDs = deathLogSort(nodeIDs, tree, q.sort);
	const nodeMap = new Map(nodes.map((n) => [n.id, n]));
	return sortedIDs
		.map((id) => nodeMap.get(id))
		.filter((node): node is DistinctTreeNode => node !== undefined);
}

export function sortDeaths(deaths: Death[], q: DeathQuery): Death[] {
	const { sortingKey, ascending } = q.sort;

	function order(x: number, y: number): number {
		return ascending ? x - y : y - x;
	}

	return deaths.toSorted((a, b) => {
		switch (sortingKey) {
			case "timestamp":
				return order(
					new Date(a.timestamp).getTime(),
					new Date(b.timestamp).getTime(),
				);
			case "remark": {
				const ra = a.remark ?? "";
				const rb = b.remark ?? "";
				if (ra < rb) return order(0, 1);
				if (ra > rb) return order(1, 0);
				return 0;
			}
		}
	});
}
