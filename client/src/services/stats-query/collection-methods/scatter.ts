import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type {
	ChartData,
	ScatterPoint,
} from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { TreeWalker } from "../TreeWalker";

function parseTimeSpentToMinutes(timeSpent: string): number {
	const [hrs, mins, secs] = timeSpent.split(":").map(Number);
	return hrs * 60 + mins + secs / 60;
}

export function deathsVsTimeSpent(query: Query, tree: Tree): ChartData {
	const points: ScatterPoint[] = TreeWalker.subjects(query.scope, tree)
		.filter((subject) => subject.timeSpent != null)
		.map((subject) => ({
			name: subject.name,
			x: subject.log.length,
			y: parseTimeSpentToMinutes(subject.timeSpent as string),
		}));
	return { kind: "scatter", points };
}
