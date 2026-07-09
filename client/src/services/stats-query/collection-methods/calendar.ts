import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { TreeWalker } from "../TreeWalker";

export function deathsByDay(
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
): ChartData {
	const points: { x: string; y: number }[] = [];
	for (const subject of TreeWalker.subjects(query.scope, tree)) {
		for (const death of subject.log) {
			if (!includeUnreliable && !death.timestampRel) continue;
			points.push({ x: death.timestamp, y: 1 });
		}
	}
	return { kind: "category", points };
}
