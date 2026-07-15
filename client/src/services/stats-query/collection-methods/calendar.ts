import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { TreeWalker } from "../TreeWalker";
import { isoToDateSTD } from "../../../utils/date";

export function deathsByDay(
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
): ChartData {
	const byDay = new Map<string, number>();
	for (const subject of TreeWalker.subjects(query.scope, tree)) {
		for (const death of subject.log) {
			if (!includeUnreliable && !death.timestampRel) continue;
			const day = isoToDateSTD(death.timestamp);
			byDay.set(day, (byDay.get(day) ?? 0) + 1);
		}
	}
	const points = [...byDay.entries()].map(([x, y]) => ({ x, y }));
	return { kind: "category", points };
}
