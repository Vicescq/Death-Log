import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { TreeWalker } from "../TreeWalker";

export function deathsByRecentCompleted(
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
): ChartData {
	const points = TreeWalker.subjects(query.scope, tree)
		.filter((subject) => subject.completed && subject.dateEnd)
		.filter((subject) => includeUnreliable || subject.dateEndRel)
		.filter((subject) => subject.log.length > 0)
		.sort(
			(a, b) =>
				new Date(b.dateEnd as string).getTime() -
				new Date(a.dateEnd as string).getTime(),
		)
		.slice(0, 30)
		.map((subject) => ({ x: subject.name, y: subject.log.length }));
	return { kind: "category", points };
}
