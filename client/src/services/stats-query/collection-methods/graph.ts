import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData, Graph } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { calcDeaths } from "../../../pages/death-log/utils";

export function graph(_query: Query, tree: Tree): ChartData {
	const nodes: Graph["nodes"] = [];
	const edges: Graph["edges"] = [];

	const CATEGORY_BY_TYPE: Record<"game" | "profile" | "subject", number> = {
		game: 0,
		profile: 1,
		subject: 2,
	};

	for (const node of tree.values()) {
		if (node.type === "ROOT_NODE") continue;

		nodes.push({
			id: node.id,
			name: node.name,
			value: calcDeaths(node, tree),
			category: CATEGORY_BY_TYPE[node.type],
		});

		const parent = tree.get(node.parentID);
		if (parent && parent.type !== "ROOT_NODE") {
			edges.push({
				id: `${parent.id}-${node.id}`,
				source: parent.id,
				target: node.id,
			});
		}
	}

	const graph: Graph = {
		categories: [
			{ name: "Games" },
			{ name: "Profiles" },
			{ name: "Subjects" },
		],
		nodes,
		edges,
	};
	return { kind: "graph", graph };
}
