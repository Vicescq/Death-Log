import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { calcDeaths } from "../../../pages/death-log/utils";
import { TreeWalker } from "../TreeWalker";

export function deathsByContext(
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
): ChartData {
	const totals = new Map<string, number>();
	for (const subject of TreeWalker.subjects(query.scope, tree)) {
		const count = includeUnreliable
			? subject.log.length
			: subject.log.filter((death) => death.timestampRel).length;
		totals.set(subject.context, (totals.get(subject.context) ?? 0) + count);
	}
	const points = [...totals.entries()]
		.map(([x, y]) => ({ x, y }))
		.sort((a, b) => a.x.localeCompare(b.x))
		.filter((point) => point.y > 0);
	return { kind: "category", points };
}

export function deathsByGame(_query: Query, tree: Tree): ChartData {
	const points = TreeWalker.games(tree)
		.map((game) => ({ x: game.name, y: calcDeaths(game, tree) }))
		.sort((a, b) => a.y - b.y)
		.slice(-10)
		.filter((point) => point.y > 0);
	return { kind: "category", points };
}

export function deathsByProfile(_query: Query, tree: Tree): ChartData {
	const points = TreeWalker.profiles(tree)
		.map((profile) => ({ x: profile.name, y: calcDeaths(profile, tree) }))
		.sort((a, b) => a.y - b.y)
		.slice(-5)
		.filter((point) => point.y > 0);
	return { kind: "category", points };
}
