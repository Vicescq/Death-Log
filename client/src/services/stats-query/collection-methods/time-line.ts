import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { TreeWalker } from "../TreeWalker";

export function deathsCumulative(
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
): ChartData {
	const timestamps: string[] = [];
	for (const subject of TreeWalker.subjects(query.scope, tree)) {
		for (const death of subject.log) {
			if (!includeUnreliable && !death.timestampRel) continue;
			timestamps.push(death.timestamp);
		}
	}

	timestamps.sort();
	const points = timestamps.map((timestamp, index) => ({
		x: timestamp,
		y: index + 1,
	}));
	return { kind: "category", points };
}
