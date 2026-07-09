import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { TreeWalker } from "../TreeWalker";

function toTitleCase(lowercased: string): string {
	return lowercased
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function bossDeathsBySubject(
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
): ChartData {
	const totals = new Map<string, number>();
	for (const subject of TreeWalker.subjects(query.scope, tree)) {
		if (subject.context !== "Boss") continue;
		const count = includeUnreliable
			? subject.log.length
			: subject.log.filter((death) => death.timestampRel).length;
		const key = subject.name.toLowerCase();
		totals.set(key, (totals.get(key) ?? 0) + count);
	}
	const points = [...totals.entries()]
		.map(([key, y]) => ({ x: toTitleCase(key), y }))
		.sort((a, b) => a.y - b.y)
		.slice(-5)
		.filter((point) => point.y > 0);
	return { kind: "category", points };
}

export function subjectCountByGame(_query: Query, tree: Tree): ChartData {
	const points = TreeWalker.games(tree)
		.map((game) => ({
			x: game.name,
			y: TreeWalker.subjects([game.id], tree).length,
		}))
		.sort((a, b) => a.y - b.y)
		.slice(-10)
		.filter((point) => point.y > 0);
	return { kind: "category", points };
}
